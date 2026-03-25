export class DomainExceptions extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DomainExceptions'
    }
}