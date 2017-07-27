import { models } from './models';

export function migrate() {
    for (let m in models) {
        models[m].sync({ force: true })
    }

}
