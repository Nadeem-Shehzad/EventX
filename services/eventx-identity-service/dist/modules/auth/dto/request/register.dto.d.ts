export declare class ImageDTO {
    url: string;
    publicId: string;
}
export declare class RegisterDTO {
    name: string;
    email: string;
    password: string;
    image: ImageDTO;
    role?: string;
}
