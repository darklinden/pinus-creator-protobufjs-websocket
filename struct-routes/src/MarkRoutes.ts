export function MarkRoute(route: string, client: any, server: any) {
    return function (target: any, name: string, descriptor: any) {
        // this decorator is used to mark a route
        // it will be used to generate the client and server side code
        // console.log("MarkRouteDecorator(): called", target, name, descriptor);
    }
}
