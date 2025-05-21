import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { PrismaService } from '../prisma';
import { TierName } from '@prisma/client';
import { response } from '../common/utils';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly saltRounds: number = 10;

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

    const { password, ...userWithoutPassword } = created_user;
    return response.success<User>(
      userWithoutPassword,
      'Registracija uspešna! Bićete preusmereni na prijavu za 3 sekunde.',
    );
  }

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

    const { password: _, ...user } = found_user;

    return response.success<User>(user, 'Uspešno ste se prijavili.');
  }
}
