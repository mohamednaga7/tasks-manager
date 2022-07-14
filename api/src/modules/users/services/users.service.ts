import { PrismaClient } from '@prisma/client'
import { Service } from 'typedi'
import { UserSignupInput } from '../types/user-signup-input.type'
import { User } from '../models/user.model'
import { UserSigninInput } from '../types/user-signin-input.type'
import { UserWithToken } from '../types/user-with-token.type'
import { AuthService } from './auth.service'

@Service()
export class UsersService {
  constructor(
    private prismaClient: PrismaClient,
    private authService: AuthService,
  ) {}

  public async getUser(id: string): Promise<User> {
    return this.prismaClient.user.findUniqueOrThrow({
      where: {
        id,
      },
    })
  }

  public async getCurrentUser(authUser: Partial<User>): Promise<User> {
    const user = await this.prismaClient.user.findUniqueOrThrow({
      where: {
        id: authUser.id,
      },
    })
    return user
  }

  public async getUsers({ limit = 20, skip = 0 }): Promise<User[]> {
    return this.prismaClient.user.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        firstName: 'asc',
        lastName: 'asc',
      },
    })
  }

  public async signupUser(
    userSignupInput: UserSignupInput,
  ): Promise<UserWithToken> {
    const foundUser = await this.prismaClient.user.findFirst({
      where: {
        OR: [
          { email: userSignupInput.email },
          { username: userSignupInput.username },
        ],
      },
    })

    if (foundUser) throw new Error('User already exist')

    const hashedPassword = await this.authService.hashUserPassword(
      userSignupInput.password,
    )

    const user = await this.prismaClient.user.create({
      data: {
        ...userSignupInput,
        password: hashedPassword,
      },
    })

    const token = this.authService.generateJWTToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    return { user, token }
  }

  public async signinUser(
    userSigninInput: UserSigninInput,
  ): Promise<UserWithToken> {
    const user = await this.prismaClient.user.findFirst({
      where: {
        OR: [
          { email: userSigninInput.emailOrUsername },
          { username: userSigninInput.emailOrUsername },
        ],
      },
    })

    if (!user) throw new Error('Wrong Credentials')

    const isPasswordCorrect = await this.authService.compareUserPassword(
      userSigninInput.password,
      user.password,
    )

    if (!isPasswordCorrect) throw new Error('Wrong Credentials')

    const token = this.authService.generateJWTToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    return { user, token }
  }
}
