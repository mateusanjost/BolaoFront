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
var TreeNodeCheckboxComponent = /** @class */ (function () {
    function TreeNodeCheckboxComponent() {
    }
    __decorate([
        Input(),
        __metadata("design:type", TreeNode)
    ], TreeNodeCheckboxComponent.prototype, "node", void 0);
    TreeNodeCheckboxComponent = __decorate([
        Component({
            selector: 'tree-node-checkbox',
            encapsulation: ViewEncapsulation.None,
            styles: [],
            template: "\n    <ng-container *mobxAutorun=\"{dontDetach: true}\">\n      <input\n        class=\"tree-node-checkbox\"\n        type=\"checkbox\"\n        (click)=\"node.mouseAction('checkboxClick', $event)\"\n        [checked]=\"node.isSelected\"\n        [indeterminate]=\"node.isPartiallySelected\"/>\n    </ng-container>\n  "
        })
    ], TreeNodeCheckboxComponent);
    return TreeNodeCheckboxComponent;
}());
export { TreeNodeCheckboxComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ub2RlLWNoZWNrYm94LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUtbm9kZS1jaGVja2JveC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBaUJyRDtJQUFBO0lBRUEsQ0FBQztJQURVO1FBQVIsS0FBSyxFQUFFO2tDQUFPLFFBQVE7MkRBQUM7SUFEYix5QkFBeUI7UUFmckMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLG9CQUFvQjtZQUM5QixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtZQUNyQyxNQUFNLEVBQUUsRUFBRTtZQUNWLFFBQVEsRUFBRSxnVUFTVDtTQUNGLENBQUM7T0FDVyx5QkFBeUIsQ0FFckM7SUFBRCxnQ0FBQztDQUFBLEFBRkQsSUFFQztTQUZZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUcmVlTm9kZSB9IGZyb20gJy4uL21vZGVscy90cmVlLW5vZGUubW9kZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd0cmVlLW5vZGUtY2hlY2tib3gnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdHlsZXM6IFtdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250YWluZXIgKm1vYnhBdXRvcnVuPVwie2RvbnREZXRhY2g6IHRydWV9XCI+XG4gICAgICA8aW5wdXRcbiAgICAgICAgY2xhc3M9XCJ0cmVlLW5vZGUtY2hlY2tib3hcIlxuICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAoY2xpY2spPVwibm9kZS5tb3VzZUFjdGlvbignY2hlY2tib3hDbGljaycsICRldmVudClcIlxuICAgICAgICBbY2hlY2tlZF09XCJub2RlLmlzU2VsZWN0ZWRcIlxuICAgICAgICBbaW5kZXRlcm1pbmF0ZV09XCJub2RlLmlzUGFydGlhbGx5U2VsZWN0ZWRcIi8+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgVHJlZU5vZGVDaGVja2JveENvbXBvbmVudCB7XG4gIEBJbnB1dCgpIG5vZGU6IFRyZWVOb2RlO1xufVxuIl19