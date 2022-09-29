"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkRoute = void 0;
function MarkRoute(route, client, server) {
    return function (target, name, descriptor) {
        console.log("MarkRouteDecorator(): called", target, name, descriptor);
    };
}
exports.MarkRoute = MarkRoute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vcm91dGUtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLFNBQWdCLFNBQVMsQ0FBQyxLQUFhLEVBQUUsTUFBVyxFQUFFLE1BQVc7SUFDN0QsT0FBTyxVQUFVLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVTtRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDMUUsQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQUpELDhCQUlDIn0=