type Response<T = null> = {
	success: boolean;
	message: string;
	data: T;
};

export default Response;
