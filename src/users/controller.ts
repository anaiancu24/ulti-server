import { JsonController, Get, Param, Body, Post } from 'routing-controllers';
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
        const { account } = data
        const { password, firstName, lastName, email } = data
        const entity = User.create({
            firstName,
            lastName,
            email,
            isAdmin: false
            })
        await entity.setPassword(password)
        const user = await entity.save()

        if (account.includes('player')) {
            await Player.create({
                user,
                location: "",
                description: ""
            }).save()
        }

        if (account.includes('coach')) {
            await Coach.create({
                user,
                description: ""
            }).save()
        }

        // Create a new Owner when signing up
        if (account.includes('owner')) {
            await Owner.create({
                user, 
                shares: 0
            }).save()
        }

        return { user }
    }


    @Get('/users/:id([0-9]+)')
    async getUser(
        @Param('id') id: number
    ) {
        const users = await User.findOne(id)
        return { users }
    }

    @Get('/users')
    async allUsers() {
        const user = await User.find()
        return { user }
    }
}