import { useRootLoaderData } from "~/client/hooks/use-root-loader-data";
import { formatBytes, type FormatBytesOptions } from "~/utils/format-bytes";

export const useFormatBytes = () => {
	const { locale } = useRootLoaderData();

	return (bytes: number, options?: FormatBytesOptions) =>
		formatBytes(bytes, {
			...options,
			locale: options?.locale ?? locale,
		});
};
