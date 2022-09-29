"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkRoute = void 0;
function MarkRoute(route, client, server) {
    return function (target, name, descriptor) {
        console.log("MarkRouteDecorator(): called", target, name, descriptor);
    };
}
exports.MarkRoute = MarkRoute;
//# sourceMappingURL=MarkRoutes.js.map