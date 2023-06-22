// Main file where we define user rules and permissions
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

export enum Action {
  MANAGE = 'manage', // Special action that represents any action(wildcard)
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type Subjects = InferSubjects<typeof User> | 'all'; // which entities will the rules be applied to

export type AppAbility = MongoAbility<[Action, Subjects]>; // Bind rule of Action with Subjects

@Injectable()
export class AbilityFactory {
  defineAbilitiesFor(user: User) {
    // Define abilities for user
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );
    if (user.isAdmin) {
      can(Action.MANAGE, 'all'); // Admin can do anything
      cannot(Action.MANAGE, User, { orgId: { $ne: user.orgId } }).because(
        'You can only manage users in your organization',
      );
    } else {
      can(Action.READ, 'all');
      cannot(Action.CREATE, User).because('You are not authorized to create');
      cannot(Action.DELETE, User).because('You are not authorized to delete');
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    }); // Return rules
  }
}
