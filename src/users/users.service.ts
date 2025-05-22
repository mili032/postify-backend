import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { PrismaService } from '../prisma';
import { TierName } from '@prisma/client';
import { response } from '../common/utils';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

/**
 * Servis za upravljanje korisnicima
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /** Broj rundi za heširanje lozinke */
  private readonly saltRounds: number = 10;

  /** Generiše JWT token za korisnika */
  private generateToken(user: User): string {
    return this.jwtService.sign(user);
  }

  /**
   * Kreira novog korisnika
   * @param data Podaci za kreiranje korisnika (email, lozinka, ime, prezime)
   * @returns Kreiran korisnik bez lozinke
   * @throws {HttpException} 409 - Ako korisnik sa datim email-om već postoji
   * @throws {HttpException} 500 - Ako dođe do greške pri kreiranju korisnika
   */
  async create(data: CreateUserDto) {
    const is_existing = await this.prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (is_existing) {
      return response.error(`Korisnik sa ovim email-om već postoji.`, 409);
    }

    const hashed_password: string = await bcrypt.hash(
      data.password,
      this.saltRounds,
    );

    const created_user = await this.prisma.users.create({
      data: {
        email: data.email,
        password: hashed_password,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
        tier: {
          connectOrCreate: {
            where: {
              id: 1,
            },
            create: {
              name: 'Free' as TierName,
              price: 0,
            },
          },
        },
      },
    });

    if (!created_user.id) {
      return response.error(
        'Greška pri kreiranju korisnika. Molimo pokušajte ponovo.',
        500,
      );
    }

    const { password, ...user_without_password } = created_user;
    return response.success<User>(
      user_without_password,
      'Registracija uspešna! Bićete preusmereni na prijavu za 3 sekunde.',
    );
  }

  /**
   * Prijavljuje korisnika
   * @param data Podaci za prijavu (email, lozinka)
   * @returns Podaci o korisniku bez lozinke
   * @throws {HttpException} 400 - Ako email ili lozinka nisu prosleđeni
   * @throws {HttpException} 404 - Ako korisnik nije pronađen
   * @throws {HttpException} 401 - Ako je lozinka neispravna
   */
  async login(data: LoginUserDto) {
    const { email, password } = data;

    if (!email || !password) {
      return response.error('Email i lozinka su obavezni.', 400);
    }

    const found_user = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!found_user) {
      return response.error(`Korisnik nije pronađen.`, 404);
    }

    const is_password_valid: boolean = await bcrypt.compare(
      password,
      found_user.password,
    );

    if (!is_password_valid) {
      return response.error('Neispravna lozinka.', 401);
    }

    const { password: _, createdAt, updatedAt, ...user } = found_user;

    // Generiše JWT token
    const token = this.generateToken(user);

    return response.success<{ bearer_token: string }>(
      {
        bearer_token: token,
      },
      'Uspešno ste se prijavili.',
    );
  }

  /**
   * Proverava JWT token.
   *
   * @param {string} token - Token koji se verifikuje.
   * @return {Promise<object>} - Vraća dekodirani token ako je validan, ili grešku ako nije.
   */
  async verifyToken(token: string): Promise<object | void> {
    if (!token) {
      return response.error('Token nije prosleđen.', 401);
    }

    // Uklanja "Bearer " deo iz tokena
    const token_parts = token.split(' ');
    if (token_parts.length !== 2 || token_parts[0] !== 'Bearer') {
      return response.error('Token nije validan.', 401);
    }

    token = token_parts[1];

    try {
      const decoded = this.jwtService.verify(token);
      return response.success(
        {
          ...decoded,
          token,
        },
        'Token je validan.',
      );
    } catch (error) {
      return response.error('Token nije validan.', 401);
    }
  }
}
