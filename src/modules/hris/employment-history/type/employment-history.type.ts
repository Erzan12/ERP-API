export type Repository = {
  findUnique(args: {
    where: {
      id: string;
    };
  }): Promise<any>;
};
