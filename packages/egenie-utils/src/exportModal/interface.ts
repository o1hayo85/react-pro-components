interface Template{
  id: number;
  templateName: string;
  fields: Fields[];
  tenantId?: number;
}

interface Fields {
  baseSerializeSchemaName: string;
  id: string;
}

export { Template, Fields };
