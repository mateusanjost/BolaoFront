var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';
var TreeNodeComponent = /** @class */ (function () {
    function TreeNodeComponent() {
    }
    __decorate([
        Input(),
        __metadata("design:type", TreeNode)
    ], TreeNodeComponent.prototype, "node", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], TreeNodeComponent.prototype, "index", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], TreeNodeComponent.prototype, "templates", void 0);
    TreeNodeComponent = __decorate([
        Component({
            selector: 'TreeNode, tree-node',
            encapsulation: ViewEncapsulation.None,
            styles: [],
            template: "\n    <ng-container *mobxAutorun=\"{dontDetach: true}\">\n      <div\n        *ngIf=\"!templates.treeNodeFullTemplate\"\n        [class]=\"node.getClass()\"\n        [class.tree-node]=\"true\"\n        [class.tree-node-expanded]=\"node.isExpanded && node.hasChildren\"\n        [class.tree-node-collapsed]=\"node.isCollapsed && node.hasChildren\"\n        [class.tree-node-leaf]=\"node.isLeaf\"\n        [class.tree-node-active]=\"node.isActive\"\n        [class.tree-node-focused]=\"node.isFocused\"\n        >\n\n        <tree-node-drop-slot *ngIf=\"index === 0\" [dropIndex]=\"node.index\" [node]=\"node.parent\"></tree-node-drop-slot>\n\n        <tree-node-wrapper [node]=\"node\" [index]=\"index\" [templates]=\"templates\"></tree-node-wrapper>\n\n        <tree-node-children [node]=\"node\" [templates]=\"templates\"></tree-node-children>\n        <tree-node-drop-slot [dropIndex]=\"node.index + 1\" [node]=\"node.parent\"></tree-node-drop-slot>\n      </div>\n      <ng-container\n        [ngTemplateOutlet]=\"templates.treeNodeFullTemplate\"\n        [ngTemplateOutletContext]=\"{ $implicit: node, node: node, index: index, templates: templates }\">\n      </ng-container>\n    </ng-container>"
        })
    ], TreeNodeComponent);
    return TreeNodeComponent;
}());
export { TreeNodeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ub2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUtbm9kZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQWUsTUFBTSxlQUFlLENBQUM7QUFDakYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBaUNyRDtJQUFBO0lBSUEsQ0FBQztJQUhVO1FBQVIsS0FBSyxFQUFFO2tDQUFPLFFBQVE7bURBQUM7SUFDZjtRQUFSLEtBQUssRUFBRTs7b0RBQWU7SUFDZDtRQUFSLEtBQUssRUFBRTs7d0RBQWdCO0lBSGIsaUJBQWlCO1FBL0I3QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUscUJBQXFCO1lBQy9CLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1lBQ3JDLE1BQU0sRUFBRSxFQUFFO1lBQ1YsUUFBUSxFQUFFLG1yQ0F3QlE7U0FDbkIsQ0FBQztPQUVXLGlCQUFpQixDQUk3QjtJQUFELHdCQUFDO0NBQUEsQUFKRCxJQUlDO1NBSlksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb24sIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUcmVlTm9kZSB9IGZyb20gJy4uL21vZGVscy90cmVlLW5vZGUubW9kZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdUcmVlTm9kZSwgdHJlZS1ub2RlJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc3R5bGVzOiBbXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICptb2J4QXV0b3J1bj1cIntkb250RGV0YWNoOiB0cnVlfVwiPlxuICAgICAgPGRpdlxuICAgICAgICAqbmdJZj1cIiF0ZW1wbGF0ZXMudHJlZU5vZGVGdWxsVGVtcGxhdGVcIlxuICAgICAgICBbY2xhc3NdPVwibm9kZS5nZXRDbGFzcygpXCJcbiAgICAgICAgW2NsYXNzLnRyZWUtbm9kZV09XCJ0cnVlXCJcbiAgICAgICAgW2NsYXNzLnRyZWUtbm9kZS1leHBhbmRlZF09XCJub2RlLmlzRXhwYW5kZWQgJiYgbm9kZS5oYXNDaGlsZHJlblwiXG4gICAgICAgIFtjbGFzcy50cmVlLW5vZGUtY29sbGFwc2VkXT1cIm5vZGUuaXNDb2xsYXBzZWQgJiYgbm9kZS5oYXNDaGlsZHJlblwiXG4gICAgICAgIFtjbGFzcy50cmVlLW5vZGUtbGVhZl09XCJub2RlLmlzTGVhZlwiXG4gICAgICAgIFtjbGFzcy50cmVlLW5vZGUtYWN0aXZlXT1cIm5vZGUuaXNBY3RpdmVcIlxuICAgICAgICBbY2xhc3MudHJlZS1ub2RlLWZvY3VzZWRdPVwibm9kZS5pc0ZvY3VzZWRcIlxuICAgICAgICA+XG5cbiAgICAgICAgPHRyZWUtbm9kZS1kcm9wLXNsb3QgKm5nSWY9XCJpbmRleCA9PT0gMFwiIFtkcm9wSW5kZXhdPVwibm9kZS5pbmRleFwiIFtub2RlXT1cIm5vZGUucGFyZW50XCI+PC90cmVlLW5vZGUtZHJvcC1zbG90PlxuXG4gICAgICAgIDx0cmVlLW5vZGUtd3JhcHBlciBbbm9kZV09XCJub2RlXCIgW2luZGV4XT1cImluZGV4XCIgW3RlbXBsYXRlc109XCJ0ZW1wbGF0ZXNcIj48L3RyZWUtbm9kZS13cmFwcGVyPlxuXG4gICAgICAgIDx0cmVlLW5vZGUtY2hpbGRyZW4gW25vZGVdPVwibm9kZVwiIFt0ZW1wbGF0ZXNdPVwidGVtcGxhdGVzXCI+PC90cmVlLW5vZGUtY2hpbGRyZW4+XG4gICAgICAgIDx0cmVlLW5vZGUtZHJvcC1zbG90IFtkcm9wSW5kZXhdPVwibm9kZS5pbmRleCArIDFcIiBbbm9kZV09XCJub2RlLnBhcmVudFwiPjwvdHJlZS1ub2RlLWRyb3Atc2xvdD5cbiAgICAgIDwvZGl2PlxuICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZXMudHJlZU5vZGVGdWxsVGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IG5vZGUsIG5vZGU6IG5vZGUsIGluZGV4OiBpbmRleCwgdGVtcGxhdGVzOiB0ZW1wbGF0ZXMgfVwiPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9uZy1jb250YWluZXI+YFxufSlcblxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlQ29tcG9uZW50IHtcbiAgQElucHV0KCkgbm9kZTogVHJlZU5vZGU7XG4gIEBJbnB1dCgpIGluZGV4OiBudW1iZXI7XG4gIEBJbnB1dCgpIHRlbXBsYXRlczogYW55O1xufVxuIl19