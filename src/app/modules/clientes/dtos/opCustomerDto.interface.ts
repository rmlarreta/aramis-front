import { OpCustomerInsert } from "./opCustomerInsert.interface";

export interface OpCustomerDto extends OpCustomerInsert {
	respName: string | null;
	genderName: string | null;
	paisName: string | null;
}