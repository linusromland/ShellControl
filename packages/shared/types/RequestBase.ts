type RequestBase<T = any> = {
	success: boolean;
	message: string;
	data: T;
};

export default RequestBase;
