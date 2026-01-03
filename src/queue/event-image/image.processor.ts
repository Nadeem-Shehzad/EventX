import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { v2 as cloudinary } from 'cloudinary';

import { QUEUES } from "../queue.constants";


@Processor(QUEUES.EVENT_IMAGE)
export class EventImageProcessor extends WorkerHost {
   async process(job: Job) {
      console.log('Image-processor ... runs');
      const { publicId } = job.data;
      await cloudinary.uploader.destroy(publicId);
   }
}