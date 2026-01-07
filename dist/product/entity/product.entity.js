"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.ProductStatus = exports.TradeMethod = exports.ProductCondition = exports.ProductCategory = void 0;
const typeorm_1 = require("typeorm");
const base_table_entity_1 = require("../../common/entity/base-table.entity");
const user_entity_1 = require("../../user/entity/user.entity");
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["equipment"] = "equipment";
    ProductCategory["supplement"] = "supplement";
    ProductCategory["clothing"] = "clothing";
    ProductCategory["shoes"] = "shoes";
    ProductCategory["etc"] = "etc";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var ProductCondition;
(function (ProductCondition) {
    ProductCondition["brandNew"] = "brandNew";
    ProductCondition["usedExcellent"] = "usedExcellent";
    ProductCondition["usedGood"] = "usedGood";
    ProductCondition["usedFair"] = "usedFair";
})(ProductCondition || (exports.ProductCondition = ProductCondition = {}));
var TradeMethod;
(function (TradeMethod) {
    TradeMethod["direct"] = "direct";
    TradeMethod["delivery"] = "delivery";
    TradeMethod["both"] = "both";
})(TradeMethod || (exports.TradeMethod = TradeMethod = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["selling"] = "selling";
    ProductStatus["reserved"] = "reserved";
    ProductStatus["sold"] = "sold";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
let Product = class Product extends base_table_entity_1.BaseTable {
    id;
    sellerId;
    seller;
    title;
    category;
    price;
    condition;
    description;
    tradeMethod;
    baseAddress;
    detailAddress;
    imageUrls;
    viewCount;
    favoriteCount;
    chatCount;
    status;
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Product.prototype, "sellerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'sellerId' }),
    __metadata("design:type", user_entity_1.User)
], Product.prototype, "seller", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProductCategory }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProductCondition }),
    __metadata("design:type", String)
], Product.prototype, "condition", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TradeMethod }),
    __metadata("design:type", String)
], Product.prototype, "tradeMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "baseAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "detailAddress", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "imageUrls", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "favoriteCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "chatCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProductStatus, default: ProductStatus.selling }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['sellerId']),
    (0, typeorm_1.Index)(['category']),
    (0, typeorm_1.Index)(['createdAt'])
], Product);
//# sourceMappingURL=product.entity.js.map