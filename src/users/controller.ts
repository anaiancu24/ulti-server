import { JsonController, Get, Authorized, CurrentUser, Body, Post, NotFoundError } from 'routing-controllers'
import User from './entity'
import Player from '../player/entity'
import Coach from '../coach/entity'
import Owner from '../owner/entity'


@JsonController()
export default class UserController {

    @Post('/users')
    async createUser(
        @Body() data: User
    ) {
        const { password, firstName, lastName, email, account } = data
        const entity = User.create({
            firstName,
            lastName,
            email,
            isAdmin: false,
            account
            })
        await entity.setPassword(password)
        const user = await entity.save()

        // Create a new Player when signing up
        if (account.includes('player')) {
            await Player.create({
                user,
                nominatedTeams: [],
                hasPaid: false,
                outOfArea: false
            }).save()
        }

        // Create a new Coach when signing up
        if (account.includes('coach')) {
            await Coach.create({
                user,
                hasPaid: false,
                nominatedTeam: null
            }).save()
        }

        // Create a new Owner when signing up
        if (account.includes('owner')) {
            await Owner.create({
                user, 
                shares: 0,
                votingPower: 0
            }).save()
        }

        return { user }
    }


    @Get('/users')
    async allUsers() {
        const users = await User.find()
        return { users }
    }

    @Authorized()
    @Get('/user')
    async getUser(
        @CurrentUser() currentUser: User
    ) {
        const user = await User.findOne(currentUser.id)
        if (!user) throw new NotFoundError(`Cannot find user`)
        
        return { user }
    }
}