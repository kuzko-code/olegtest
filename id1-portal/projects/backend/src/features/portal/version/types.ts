export type version = {    
	version: string;
	created_date: Date;
};
export type create_version_payload = {    
	version: string;
	created_date: Date;
};

export type get_versions = {
	url: string;
	query: any;
	includedResources: string[];
};