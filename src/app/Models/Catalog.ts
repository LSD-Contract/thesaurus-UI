export class Catalog {
  id!: number;
  name!: string;
	categoryId!: number;
	documentTypeId!: number;
	documentName!: string;
	author!: string;
	citation!: string;
	classificationId!: number;
	alternateCategory!: string;
  documentType!: string;
  classification!: string;
  savedfilename!: string;
  file!: Blob;
}
