import { JsonController, Get, Param, Body, Post  } from 'routing-controllers';
import User from './entity'
import Player from '../player/entity'
import Coach from '../coach/entity'
import Owner from '../owner/entity'
//import { io } from '../index'

@JsonController()
export default class UserController {

    @Post('/users')
    async createUser(
        @Body() data: User
    ) {
        const { account } = data
        const {password, ...rest} = data
        const entity = User.create(rest)
        await entity.setPassword(password)
        const user = await entity.save()

        if (account.includes('player')) {
            Player.create({
                user,
                location:"",
                description: ""
            }).save()
        }

        if (account.includes('coach')) {
            Coach.create({
                user,
                description: ""        
            }).save()              
        }        

        if (account.includes('owner')) {
            Owner.create({
                user,
            }).save()              
        }

        return {user}
    }


    @Get('/users/:id([0-9]+)')
    getUser(
        @Param('id') id: number
    ) {
        const users = User.findOne(id) 
        return {users}
    }

    @Get('/users')
    allUsers() { 
        const user = User.find()
        return {user}
    }
}