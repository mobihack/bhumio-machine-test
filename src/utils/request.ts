import axios, { AxiosError, AxiosRequestConfig } from 'axios';

interface RequestReturn<T> {
    data: T | null;
    error: AxiosError | null;
}

/**
 * A request wrapper for axios
 * @param options - all configuration for axios instance, methods, params
 * @param type - content type header
 * @returns {Promise<object>}: {data:<result | undefined>, error:<error | undefined>}
 */
export const request = async <T>(
    options: AxiosRequestConfig,
    headers = { 'Content-Type': `application/json` }
): Promise<RequestReturn<T>> => {
    const axiosOptions = options;
    axiosOptions.headers = { ...headers, ...options.headers };
    try {
        const { data } = await axios(axiosOptions);

        return { error: null, data };
    } catch (error) {
        return { error: error as AxiosError, data: null };
    }
};
