export namespace domains {
	
	export class FileNodeDomain {
	    id: string;
	    name: string;
	    fileType: string;
	    path: string;
	    selected: boolean;
	    parentId: string;
	    FileVisiblity: string;
	    children: FileNodeDomain[];
	
	    static createFrom(source: any = {}) {
	        return new FileNodeDomain(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.fileType = source["fileType"];
	        this.path = source["path"];
	        this.selected = source["selected"];
	        this.parentId = source["parentId"];
	        this.FileVisiblity = source["FileVisiblity"];
	        this.children = this.convertValues(source["children"], FileNodeDomain);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

