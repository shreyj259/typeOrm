import {Entity, PrimaryGeneratedColumn , Column} from "typeorm";

@Entity()
export class Cat{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    Name:string

    @Column()
    ownerName:string

    @Column()
    age:number
}