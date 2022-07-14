import { ResolverContext } from './../../../types/resolver-context'
import { UserWithToken } from './../types/user-with-token.type'
import { UserSignupInput } from '../types/user-signup-input.type'
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { User } from '../models/user.model'
import { UsersService } from '../services/users.service'
import { UserSigninInput } from '../types/user-signin-input.type'
import Container from 'typedi'

@Resolver(User)
export class UsersResolver {
  usersService = Container.get(UsersService)

  @Query((_returns) => User)
  @Authorized()
  async me(@Ctx() ctx: ResolverContext) {
    return this.usersService.getCurrentUser(ctx.req.session.user!)
  }

  @Query((_returns) => [User])
  @Authorized()
  async users(@Arg('limit') limit: number, @Arg('skip') skip: number) {
    return this.usersService.getUsers({ limit, skip })
  }

  @FieldResolver((_type) => String)
  name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`
  }

  @Mutation((_returns) => UserWithToken)
  signup(
    @Arg('userSignupInput') userSignupInput: UserSignupInput,
  ): Promise<UserWithToken> {
    return this.usersService.signupUser(userSignupInput)
  }

  @Mutation((_returns) => UserWithToken)
  async signin(
    @Arg('userSigninInput') userSigninInput: UserSigninInput,
    @Ctx() ctx: ResolverContext,
  ): Promise<UserWithToken> {
    const signInResponse = await this.usersService.signinUser(userSigninInput)
    ctx.req.session.user = signInResponse.user
    return signInResponse
  }
}
