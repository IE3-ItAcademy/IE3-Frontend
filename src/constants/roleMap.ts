import { projects as stringsProjects } from "./strings.json";

export const roleClassMap: Record<string, string> = {
  [stringsProjects.dev]: "dev",
  [stringsProjects.security]: "security",
  [stringsProjects.manager]: "manager",
  [stringsProjects.qa]: "qa",
};

export const roleMap: Record<string, string> = {
  [stringsProjects.dev]: "Dev",
  [stringsProjects.security]: "Security",
  [stringsProjects.manager]: "Manager",
  [stringsProjects.qa]: "QA",
};

export const roleMapTranslation: Record<string, string> = {
  [stringsProjects.dev]: "Desenvolvedor",
  [stringsProjects.security]: "Segurança",
  [stringsProjects.manager]: "Gerente",
  [stringsProjects.qa]: "QA",
};
