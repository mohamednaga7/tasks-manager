import { AuthService } from './auth.service'
import { UserSigninInput } from './../types/user-signin-input.type'
import 'reflect-metadata'
import { PrismaClient, User } from '@prisma/client'
import Container from 'typedi'
import { UserSignupInput } from '../types/user-signup-input.type'
import { UsersService } from './users.service'

describe('UsersService', () => {
  const mockedAuthService: {
    hashUserPassword: jest.Mock<any, any>
    generateJWTToken: jest.Mock<any, any>
    getUserFromToken: jest.Mock<any, any>
    compareUserPassword: jest.Mock<any, any>
  } = {
    hashUserPassword: jest.fn(),
    generateJWTToken: jest.fn(),
    getUserFromToken: jest.fn(),
    compareUserPassword: jest.fn(),
  }
  const mockedPrisma: {
    user: {
      findUniqueOrThrow: jest.Mock<any, any>
      findFirst: jest.Mock<any, any>
      create: jest.Mock<any, any>
    }
  } = {
    user: {
      findUniqueOrThrow: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  }
  const mockedSignupInput: UserSignupInput = {
    email: 'mocked_user@mock.com',
    username: 'mocked_user_name',
    firstName: 'mocked_first_name',
    lastName: 'mocked_last_name',
    password: 'mocked_password',
  }
  const mockedRegisteredUser: User = {
    ...mockedSignupInput,
    id: 'mocked_user_id',
  }

  beforeEach(() => {
    Container.set(PrismaClient, mockedPrisma)
    Container.set(AuthService, mockedAuthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
    Container.reset()
  })

  describe('get current user', () => {
    it('should return user', async () => {
      const mockedAuthUser: Partial<User> = {
        id: 'mocked_user_id',
      }
      const mockedUser: User = {
        ...mockedRegisteredUser,
        id: 'mocked_user_id',
      }
      mockedPrisma.user.findUniqueOrThrow = jest
        .fn()
        .mockResolvedValue(mockedUser)
      expect(
        await Container.get(UsersService).getCurrentUser(mockedAuthUser),
      ).toEqual(mockedUser)
    })
  })

  // user sign up tests
  describe('signup user', () => {
    it('successfully registers the user when correct data is sent', async () => {
      mockedPrisma.user.findFirst = jest.fn().mockReturnValue(null)
      mockedPrisma.user.create = jest.fn().mockReturnValue(mockedRegisteredUser)
      mockedAuthService.generateJWTToken = jest
        .fn()
        .mockReturnValue('mocked_token')
      mockedAuthService.hashUserPassword = jest
        .fn()
        .mockReturnValue('mocked_hashed_password')

      const savedUser = await Container.get(UsersService).signupUser(
        mockedSignupInput,
      )
      expect(savedUser).toHaveProperty('token')
      expect(savedUser).toHaveProperty('user')
      expect(savedUser.user).toEqual(mockedRegisteredUser)
      expect(mockedPrisma.user.findFirst).toHaveBeenCalled()
      expect(mockedPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: mockedSignupInput.email },
            { username: mockedSignupInput.username },
          ],
        },
      })
      expect(mockedPrisma.user.create).toHaveBeenCalled()
      expect(mockedPrisma.user.create).lastCalledWith({
        data: {
          ...mockedSignupInput,
          password: 'mocked_hashed_password',
        },
      })
      expect(mockedAuthService.hashUserPassword).toHaveBeenCalled()
      expect(mockedAuthService.hashUserPassword).toHaveBeenCalledWith(
        mockedSignupInput.password,
      )
      expect(mockedAuthService.generateJWTToken).toHaveBeenCalled()
      expect(mockedAuthService.generateJWTToken).toHaveBeenCalledWith({
        id: mockedRegisteredUser.id,
        email: mockedRegisteredUser.email,
        username: mockedRegisteredUser.username,
      })
    })

    it('fail to register the user when already exists', async () => {
      mockedPrisma.user.findFirst = jest
        .fn()
        .mockReturnValue(mockedRegisteredUser)
      mockedPrisma.user.create = jest.fn()

      await expect(
        Container.get(UsersService).signupUser(mockedSignupInput),
      ).rejects.toThrowError()
      expect(mockedPrisma.user.findFirst).toHaveBeenCalled()
      expect(mockedPrisma.user.create).not.toHaveBeenCalled()
      expect(mockedAuthService.generateJWTToken).not.toHaveBeenCalled()
      expect(mockedAuthService.hashUserPassword).not.toHaveBeenCalled()
    })
  })

  // user sign in tests
  describe('signin user', () => {
    const mockedSigninInput: UserSigninInput = {
      emailOrUsername: 'mocked_user@mock.com',
      password: 'mocked_password',
    }
    it('successful sign in when the user enters correct credentials', async () => {
      mockedPrisma.user.findFirst = jest
        .fn()
        .mockReturnValue(mockedRegisteredUser)
      mockedAuthService.compareUserPassword = jest.fn().mockReturnValue(true)
      mockedAuthService.generateJWTToken = jest
        .fn()
        .mockReturnValue('mocked_token')

      const signinResponse = await Container.get(UsersService).signinUser(
        mockedSigninInput,
      )
      expect(signinResponse).toHaveProperty('token')
      expect(signinResponse).toHaveProperty('user')
      expect(signinResponse.user).toEqual(mockedRegisteredUser)
      expect(mockedPrisma.user.findFirst).toHaveBeenCalled()
      expect(mockedPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: mockedSigninInput.emailOrUsername },
            { username: mockedSigninInput.emailOrUsername },
          ],
        },
      })
      expect(mockedAuthService.compareUserPassword).toHaveBeenCalled()
      expect(mockedAuthService.compareUserPassword).toHaveBeenCalledWith(
        mockedRegisteredUser.password,
        mockedSigninInput.password,
      )
      expect(mockedAuthService.generateJWTToken).toHaveBeenCalled()
      expect(mockedAuthService.generateJWTToken).toHaveBeenCalledWith({
        id: mockedRegisteredUser.id,
        email: mockedRegisteredUser.email,
        username: mockedRegisteredUser.username,
      })
    })

    it('fail to sign in when user not found', async () => {
      mockedPrisma.user.findFirst = jest.fn().mockReturnValue(null)

      await expect(
        Container.get(UsersService).signinUser(mockedSigninInput),
      ).rejects.toThrowError()
      expect(mockedPrisma.user.findFirst).toHaveBeenCalled()
      expect(mockedAuthService.compareUserPassword).not.toHaveBeenCalled()
      expect(mockedAuthService.generateJWTToken).not.toHaveBeenCalled()
    })

    it('fail to sign in when user enters wrong password', async () => {
      mockedPrisma.user.findFirst = jest
        .fn()
        .mockReturnValue(mockedRegisteredUser)
      mockedAuthService.compareUserPassword = jest.fn().mockReturnValue(false)

      await expect(
        Container.get(UsersService).signinUser(mockedSigninInput),
      ).rejects.toThrowError()
      expect(mockedPrisma.user.findFirst).toHaveBeenCalled()
      expect(mockedAuthService.compareUserPassword).toHaveBeenCalled()
      expect(mockedAuthService.generateJWTToken).not.toHaveBeenCalled()
    })
  })
})
