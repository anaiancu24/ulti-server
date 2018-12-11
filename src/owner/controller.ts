import { JsonController, Get, Param, Post, HttpCode, Authorized, CurrentUser } from 'routing-controllers'
import User from '../users/entity'
import Owner from './entity'


@JsonController()
export default class OwnerController {

  @Get('/owners')
  allOwners() {
      const owners = Owner.find()
    return {owners}

  }
  
  @Get('/owners/:id')
  getOwner(
    @Param('id') id: number
  ) {
      const owner = Owner.findOne(id)
    return {owner}
  }



  @Authorized()
  @Post('/owners')
  @HttpCode(201)
  async createOwner(
    @CurrentUser() currentUser: User,
  ) {
    const user = await User.findOne(currentUser.id)

    if (user){
      user.account.push('owner')
    }

    user!.save()

    const entity = Owner.create({
      user,
      shares: null,
      teams: null
    }).save()

    return {entity}
  }
}  


