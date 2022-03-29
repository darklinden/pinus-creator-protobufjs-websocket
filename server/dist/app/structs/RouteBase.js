"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteBase = void 0;
const Cmd_1 = require("./Cmd");
class RouteBase {
    getMap() {
        const map = new Map();
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                const element = this[key];
                if (element instanceof Cmd_1.Cmd)
                    element.reg(map);
            }
        }
        return map;
    }
}
exports.RouteBase = RouteBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVCYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL3N0cnVjdHMvUm91dGVCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUE0QjtBQUU1QixNQUFhLFNBQVM7SUFFWCxNQUFNO1FBQ1QsTUFBTSxHQUFHLEdBQXFCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDeEMsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDcEIsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNqRCxNQUFNLE9BQU8sR0FBUSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQy9CLElBQUksT0FBTyxZQUFZLFNBQUc7b0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7YUFDdkI7U0FDSjtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztDQUNKO0FBYkQsOEJBYUMifQ==