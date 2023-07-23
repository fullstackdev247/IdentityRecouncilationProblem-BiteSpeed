declare module 'mysql'{
    import {Connection, Pool, PoolConnection } from 'mysql';
   
    export function createPool(config: any): Pool;
    export function createConnection(config: any): Connection;
    export function createPoolCluster(config:any): PoolCluster;
}