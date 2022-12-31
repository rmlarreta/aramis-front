export interface PaymentIntentDto {
    additional_info: AddionalInfo | null;
    amount: number; 
} 

export interface AddionalInfo {
    external_reference: string | null;
    print_on_terminal: boolean;
    ticket_number: string | null;
}
 
export interface PaymentIntentResponseDto {
    status: string | null;
    additional_info: AddionalInfo | null;
    amount: number;
    id: string | null;
    device_id: string | null;
}