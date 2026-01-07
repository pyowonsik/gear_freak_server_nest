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
exports.ProductReport = exports.ReportStatus = exports.ReportReason = void 0;
const typeorm_1 = require("typeorm");
const base_table_entity_1 = require("../../common/entity/base-table.entity");
const user_entity_1 = require("../../user/entity/user.entity");
const product_entity_1 = require("./product.entity");
var ReportReason;
(function (ReportReason) {
    ReportReason["spam"] = "spam";
    ReportReason["inappropriate"] = "inappropriate";
    ReportReason["fake"] = "fake";
    ReportReason["prohibited"] = "prohibited";
    ReportReason["duplicate"] = "duplicate";
    ReportReason["other"] = "other";
})(ReportReason || (exports.ReportReason = ReportReason = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["pending"] = "pending";
    ReportStatus["processing"] = "processing";
    ReportStatus["resolved"] = "resolved";
    ReportStatus["rejected"] = "rejected";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
let ProductReport = class ProductReport extends base_table_entity_1.BaseTable {
    id;
    productId;
    product;
    reporterId;
    reporter;
    reason;
    description;
    status;
    processedById;
    processedBy;
    processedAt;
    processNote;
};
exports.ProductReport = ProductReport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductReport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductReport.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], ProductReport.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductReport.prototype, "reporterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'reporterId' }),
    __metadata("design:type", user_entity_1.User)
], ProductReport.prototype, "reporter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReportReason }),
    __metadata("design:type", String)
], ProductReport.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductReport.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReportStatus, default: ReportStatus.pending }),
    __metadata("design:type", String)
], ProductReport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ProductReport.prototype, "processedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'processedById' }),
    __metadata("design:type", user_entity_1.User)
], ProductReport.prototype, "processedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ProductReport.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductReport.prototype, "processNote", void 0);
exports.ProductReport = ProductReport = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['productId', 'createdAt']),
    (0, typeorm_1.Index)(['reporterId', 'createdAt']),
    (0, typeorm_1.Index)(['status', 'createdAt'])
], ProductReport);
//# sourceMappingURL=product-report.entity.js.map