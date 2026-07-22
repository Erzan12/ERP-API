export type Repository = {
  findUnique(args: {
    where: {
      id: string;
    };
  }): Promise<Record<string, unknown> | null>;
};
