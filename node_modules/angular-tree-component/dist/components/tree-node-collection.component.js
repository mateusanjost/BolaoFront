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
import { reaction } from 'mobx';
import { observable, computed, action } from 'mobx-angular';
import { TreeModel } from '../models/tree.model';
var TreeNodeCollectionComponent = /** @class */ (function () {
    function TreeNodeCollectionComponent() {
        this._dispose = [];
    }
    Object.defineProperty(TreeNodeCollectionComponent.prototype, "nodes", {
        get: function () { return this._nodes; },
        set: function (nodes) { this.setNodes(nodes); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNodeCollectionComponent.prototype, "marginTop", {
        get: function () {
            var firstNode = this.viewportNodes && this.viewportNodes.length && this.viewportNodes[0];
            var relativePosition = (firstNode && firstNode.parent)
                ? firstNode.position - firstNode.parent.position - firstNode.parent.getSelfHeight()
                : 0;
            return relativePosition + "px";
        },
        enumerable: true,
        configurable: true
    });
    TreeNodeCollectionComponent.prototype.setNodes = function (nodes) {
        this._nodes = nodes;
    };
    TreeNodeCollectionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.virtualScroll = this.treeModel.virtualScroll;
        this._dispose = [
            // return node indexes so we can compare structurally,
            reaction(function () {
                return _this.virtualScroll.getViewportNodes(_this.nodes).map(function (n) { return n.index; });
            }, function (nodeIndexes) {
                _this.viewportNodes = nodeIndexes.map(function (i) { return _this.nodes[i]; });
            }, { compareStructural: true, fireImmediately: true }),
            reaction(function () { return _this.nodes; }, function (nodes) {
                _this.viewportNodes = _this.virtualScroll.getViewportNodes(nodes);
            })
        ];
    };
    TreeNodeCollectionComponent.prototype.ngOnDestroy = function () {
        this._dispose.forEach(function (d) { return d(); });
    };
    TreeNodeCollectionComponent.prototype.trackNode = function (index, node) {
        return node.id;
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], TreeNodeCollectionComponent.prototype, "nodes", null);
    __decorate([
        Input(),
        __metadata("design:type", TreeModel)
    ], TreeNodeCollectionComponent.prototype, "treeModel", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], TreeNodeCollectionComponent.prototype, "_nodes", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], TreeNodeCollectionComponent.prototype, "templates", void 0);
    __decorate([
        observable,
        __metadata("design:type", Array)
    ], TreeNodeCollectionComponent.prototype, "viewportNodes", void 0);
    __decorate([
        computed,
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], TreeNodeCollectionComponent.prototype, "marginTop", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TreeNodeCollectionComponent.prototype, "setNodes", null);
    TreeNodeCollectionComponent = __decorate([
        Component({
            selector: 'tree-node-collection',
            encapsulation: ViewEncapsulation.None,
            template: "\n    <ng-container *mobxAutorun=\"{dontDetach: true}\">\n      <div\n        [style.margin-top]=\"marginTop\">\n        <tree-node\n          *ngFor=\"let node of viewportNodes; let i = index; trackBy: trackNode\"\n          [node]=\"node\"\n          [index]=\"i\"\n          [templates]=\"templates\">\n        </tree-node>\n      </div>\n    </ng-container>\n  "
        })
    ], TreeNodeCollectionComponent);
    return TreeNodeCollectionComponent;
}());
export { TreeNodeCollectionComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ub2RlLWNvbGxlY3Rpb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL2NvbXBvbmVudHMvdHJlZS1ub2RlLWNvbGxlY3Rpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUNwQyxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUc1RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFtQmpEO0lBakJBO1FBd0NFLGFBQVEsR0FBRyxFQUFFLENBQUM7SUE4QmhCLENBQUM7SUFuREMsc0JBQUksOENBQUs7YUFBVCxjQUFjLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDbkMsVUFBVSxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQURQO0lBV3pCLHNCQUFJLGtEQUFTO2FBQWI7WUFDUixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0YsSUFBTSxnQkFBZ0IsR0FDcEIsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQztnQkFDL0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUU7Z0JBQ25GLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFTixPQUFVLGdCQUFnQixPQUFJLENBQUM7UUFDakMsQ0FBQzs7O09BQUE7SUFJTyw4Q0FBUSxHQUFSLFVBQVMsS0FBSztRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsOENBQVEsR0FBUjtRQUFBLGlCQWNDO1FBYkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztRQUNsRCxJQUFJLENBQUMsUUFBUSxHQUFHO1lBQ2Qsc0RBQXNEO1lBQ3RELFFBQVEsQ0FBQztnQkFDUCxPQUFPLEtBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxLQUFLLEVBQVAsQ0FBTyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxFQUFFLFVBQUMsV0FBVztnQkFDWCxLQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFiLENBQWEsQ0FBQyxDQUFDO1lBQzdELENBQUMsRUFBRSxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFTLENBQzdEO1lBQ0QsUUFBUSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxFQUFWLENBQVUsRUFBRSxVQUFDLEtBQUs7Z0JBQy9CLEtBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELGlEQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsRUFBRSxFQUFILENBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCwrQ0FBUyxHQUFULFVBQVUsS0FBSyxFQUFFLElBQUk7UUFDbkIsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFqREQ7UUFEQyxLQUFLLEVBQUU7Ozs0REFDMkI7SUFHMUI7UUFBUixLQUFLLEVBQUU7a0NBQVksU0FBUztrRUFBQztJQUVsQjtRQUFYLFVBQVU7OytEQUFRO0lBRVY7UUFBUixLQUFLLEVBQUU7O2tFQUFXO0lBRVA7UUFBWCxVQUFVOztzRUFBMkI7SUFFNUI7UUFBVCxRQUFROzs7Z0VBUVI7SUFJTztRQUFQLE1BQU07Ozs7K0RBRU47SUEzQlUsMkJBQTJCO1FBakJ2QyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsc0JBQXNCO1lBQ2hDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1lBQ3JDLFFBQVEsRUFBRSwrV0FZVDtTQUNGLENBQUM7T0FDVywyQkFBMkIsQ0FxRHZDO0lBQUQsa0NBQUM7Q0FBQSxBQXJERCxJQXFEQztTQXJEWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsIElucHV0LCBWaWV3RW5jYXBzdWxhdGlvbiwgT25Jbml0LCBPbkRlc3Ryb3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyByZWFjdGlvbiB9IGZyb20gJ21vYngnO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSwgY29tcHV0ZWQsIGFjdGlvbiB9IGZyb20gJ21vYngtYW5ndWxhcic7XG5pbXBvcnQgeyBUcmVlVmlydHVhbFNjcm9sbCB9IGZyb20gJy4uL21vZGVscy90cmVlLXZpcnR1YWwtc2Nyb2xsLm1vZGVsJztcbmltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUtbm9kZS5tb2RlbCc7XG5pbXBvcnQgeyBUcmVlTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvdHJlZS5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3RyZWUtbm9kZS1jb2xsZWN0aW9uJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICptb2J4QXV0b3J1bj1cIntkb250RGV0YWNoOiB0cnVlfVwiPlxuICAgICAgPGRpdlxuICAgICAgICBbc3R5bGUubWFyZ2luLXRvcF09XCJtYXJnaW5Ub3BcIj5cbiAgICAgICAgPHRyZWUtbm9kZVxuICAgICAgICAgICpuZ0Zvcj1cImxldCBub2RlIG9mIHZpZXdwb3J0Tm9kZXM7IGxldCBpID0gaW5kZXg7IHRyYWNrQnk6IHRyYWNrTm9kZVwiXG4gICAgICAgICAgW25vZGVdPVwibm9kZVwiXG4gICAgICAgICAgW2luZGV4XT1cImlcIlxuICAgICAgICAgIFt0ZW1wbGF0ZXNdPVwidGVtcGxhdGVzXCI+XG4gICAgICAgIDwvdHJlZS1ub2RlPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgVHJlZU5vZGVDb2xsZWN0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKVxuICBnZXQgbm9kZXMoKSB7IHJldHVybiB0aGlzLl9ub2RlczsgfVxuICBzZXQgbm9kZXMobm9kZXMpIHsgdGhpcy5zZXROb2Rlcyhub2Rlcyk7IH1cblxuICBASW5wdXQoKSB0cmVlTW9kZWw6IFRyZWVNb2RlbDtcblxuICBAb2JzZXJ2YWJsZSBfbm9kZXM7XG4gIHByaXZhdGUgdmlydHVhbFNjcm9sbDogVHJlZVZpcnR1YWxTY3JvbGw7IC8vIENhbm5vdCBpbmplY3QgdGhpcywgYmVjYXVzZSB3ZSBtaWdodCBiZSBpbnNpZGUgdHJlZU5vZGVUZW1wbGF0ZUZ1bGxcbiAgQElucHV0KCkgdGVtcGxhdGVzO1xuXG4gIEBvYnNlcnZhYmxlIHZpZXdwb3J0Tm9kZXM6IFRyZWVOb2RlW107XG5cbiAgQGNvbXB1dGVkIGdldCBtYXJnaW5Ub3AoKTogc3RyaW5nIHtcbiAgICBjb25zdCBmaXJzdE5vZGUgPSB0aGlzLnZpZXdwb3J0Tm9kZXMgJiYgdGhpcy52aWV3cG9ydE5vZGVzLmxlbmd0aCAmJiB0aGlzLnZpZXdwb3J0Tm9kZXNbMF07XG4gICAgY29uc3QgcmVsYXRpdmVQb3NpdGlvbiA9XG4gICAgICAoZmlyc3ROb2RlICYmIGZpcnN0Tm9kZS5wYXJlbnQpXG4gICAgICA/IGZpcnN0Tm9kZS5wb3NpdGlvbiAtIGZpcnN0Tm9kZS5wYXJlbnQucG9zaXRpb24gLSBmaXJzdE5vZGUucGFyZW50LmdldFNlbGZIZWlnaHQoKVxuICAgICAgOiAwO1xuXG4gICAgcmV0dXJuIGAke3JlbGF0aXZlUG9zaXRpb259cHhgO1xuICB9XG5cbiAgX2Rpc3Bvc2UgPSBbXTtcblxuICBAYWN0aW9uIHNldE5vZGVzKG5vZGVzKSB7XG4gICAgdGhpcy5fbm9kZXMgPSBub2RlcztcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMudmlydHVhbFNjcm9sbCA9IHRoaXMudHJlZU1vZGVsLnZpcnR1YWxTY3JvbGw7XG4gICAgdGhpcy5fZGlzcG9zZSA9IFtcbiAgICAgIC8vIHJldHVybiBub2RlIGluZGV4ZXMgc28gd2UgY2FuIGNvbXBhcmUgc3RydWN0dXJhbGx5LFxuICAgICAgcmVhY3Rpb24oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy52aXJ0dWFsU2Nyb2xsLmdldFZpZXdwb3J0Tm9kZXModGhpcy5ub2RlcykubWFwKG4gPT4gbi5pbmRleCk7XG4gICAgICB9LCAobm9kZUluZGV4ZXMpID0+IHtcbiAgICAgICAgICB0aGlzLnZpZXdwb3J0Tm9kZXMgPSBub2RlSW5kZXhlcy5tYXAoKGkpID0+IHRoaXMubm9kZXNbaV0pO1xuICAgICAgICB9LCB7IGNvbXBhcmVTdHJ1Y3R1cmFsOiB0cnVlLCBmaXJlSW1tZWRpYXRlbHk6IHRydWUgfSBhcyBhbnlcbiAgICAgICksXG4gICAgICByZWFjdGlvbigoKSA9PiB0aGlzLm5vZGVzLCAobm9kZXMpID0+IHtcbiAgICAgICAgdGhpcy52aWV3cG9ydE5vZGVzID0gdGhpcy52aXJ0dWFsU2Nyb2xsLmdldFZpZXdwb3J0Tm9kZXMobm9kZXMpO1xuICAgICAgfSlcbiAgICBdO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGlzcG9zZS5mb3JFYWNoKGQgPT4gZCgpKTtcbiAgfVxuXG4gIHRyYWNrTm9kZShpbmRleCwgbm9kZSkge1xuICAgIHJldHVybiBub2RlLmlkO1xuICB9XG5cbn1cbiJdfQ==