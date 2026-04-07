"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventImageProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const cloudinary_1 = require("cloudinary");
const queue_constants_1 = require("../queue.constants");
let EventImageProcessor = class EventImageProcessor extends bullmq_1.WorkerHost {
    async process(job) {
        console.log('Image-processor ... runs');
        const { publicId } = job.data;
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
};
exports.EventImageProcessor = EventImageProcessor;
exports.EventImageProcessor = EventImageProcessor = __decorate([
    (0, bullmq_1.Processor)(queue_constants_1.QUEUES.EVENT_IMAGE)
], EventImageProcessor);
//# sourceMappingURL=image.processor.js.map