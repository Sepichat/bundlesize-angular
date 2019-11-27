export interface PackageData {
    name: string;
    listPackages: Array<Package>;
}

export interface Package {
    assets: {};
    gzippedSize: number;
    name: string;
    size: number;
    version: string;
}
