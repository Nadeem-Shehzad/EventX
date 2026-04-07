export declare class ImageResponseDTO {
    url: string;
    publicId: string;
}
export declare class UserResponseDTO {
    readonly _id: string;
    readonly name: string;
    readonly email: string;
    readonly image: ImageResponseDTO;
    readonly role: string;
    readonly isVerified: boolean;
}
