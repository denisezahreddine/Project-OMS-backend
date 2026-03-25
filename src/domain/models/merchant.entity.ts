
import {Injectable} from "@nestjs/common";

@Injectable()
export class MerchantEntity {
    private constructor(
        public readonly id: string,
        public email: string,
        public name: string | null,
        public password: string,
        public readonly createdAt,
        public readonly updatedAt

    ) {
    }

    static create(id: string, name: string, email: string, password: string,createdAt,updatedAt ): MerchantEntity {
        if (!email.includes('@')) {
            throw new Error('Invalid email');
        }

        if (password.length < 6) {
            throw new Error('Password too short');
        }

        return new MerchantEntity(id, name, email, password,createdAt,updatedAt);
    }

    getPassword() {
        return this.password;
    }
}