// import-fixer.ts
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
interface FileMapping {
    oldPath: string;
    newPath: string;
}
// Map of moved files and their new locations
const fileMappings: FileMapping[] = [
    // Database related moves
    {
        oldPath: "src/entities",
        newPath: "src/database/entities"
    },
    // Core/Common moves
    {
        oldPath: "src/enums",
        newPath: "src/core/enums"
    },
    {
        oldPath: "src/common",
        newPath: "src/core/common"
    },
    {
        oldPath: "src/core/config",
        newPath: "src/config"
    },
    // Security related moves
    {
        oldPath: "src/auth/guards",
        newPath: "src/security/guards"
    },
    {
        oldPath: "src/auth/decorators",
        newPath: "src/security/decorators"
    },
    {
        oldPath: "src/auth/strategies",
        newPath: "src/security/strategies"
    },
    {
        oldPath: "src/auth/services",
        newPath: "src/security/services"
    },
    // API/DTO consolidation
    {
        oldPath: "src/auth/dto",
        newPath: "src/api/dto/auth"
    },
    {
        oldPath: "src/organizations/dto",
        newPath: "src/api/dto/organizations"
    },
    {
        oldPath: "src/users/dto",
        newPath: "src/api/dto/users"
    },
    {
        oldPath: "src/client-users/dto",
        newPath: "src/api/dto/client-users"
    },
    {
        oldPath: "src/system-users/dto",
        newPath: "src/api/dto/system-users"
    },
    {
        oldPath: "src/risk-profile/dto",
        newPath: "src/api/dto/risk-profile"
    },
    // Domain moves
    {
        oldPath: "src/organizations/services",
        newPath: "src/domain/organizations/services"
    },
    {
        oldPath: "src/risk-profile/services",
        newPath: "src/domain/risk/services"
    },
    {
        oldPath: "src/users/services",
        newPath: "src/domain/users/services"
    },
    // Infrastructure moves
    {
        oldPath: "src/shared/storage",
        newPath: "src/infrastructure/storage"
    },
    {
        oldPath: "src/shared/logging",
        newPath: "src/infrastructure/logging"
    },
    {
        oldPath: "src/shared/database",
        newPath: "src/infrastructure/database"
    }
];
function createImportFixer(program: ts.Program) {
    return {
        fixImportPaths(sourceFile: ts.SourceFile): ts.TransformationResult<ts.SourceFile> {
            function visitor(ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
                return (sf: ts.SourceFile) => {
                    const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
                        if (ts.isImportDeclaration(node)) {
                            const importPath = (node.moduleSpecifier as ts.StringLiteral).text;
                            // Skip node_modules imports
                            if (!importPath.startsWith(".")) {
                                return node;
                            }
                            // Resolve the import path relative to the current file
                            const currentDir = path.dirname(sourceFile.fileName);
                            const absoluteImportPath = path.resolve(currentDir, importPath);
                            // Check if this import needs to be updated based on our mappings
                            let newPath = importPath;
                            for (const mapping of fileMappings) {
                                if (absoluteImportPath.includes(mapping.oldPath)) {
                                    // Calculate relative path from current file to new location
                                    const relativeToNew = path.relative(currentDir, absoluteImportPath.replace(mapping.oldPath, mapping.newPath));
                                    newPath = relativeToNew.startsWith(".") ? relativeToNew : "./" + relativeToNew;
                                    newPath = newPath.replace(/\\/g, "/"); // Convert Windows paths to Unix style
                                    break;
                                }
                            }
                            // Create new import declaration if path changed
                            if (newPath !== importPath) {
                                return ts.factory.createImportDeclaration(node.modifiers, node.importClause, ts.factory.createStringLiteral(newPath), undefined);
                            }
                        }
                        return ts.visitEachChild(node, visitor, ctx);
                    };
                    return ts.visitNode(sf, visitor) as ts.SourceFile;
                };
            }
            return ts.transform<ts.SourceFile>(sourceFile, [visitor]);
        }
    };
}
async function fixImports(rootDir: string) {
    // Create compiler options
    const configPath = ts.findConfigFile(rootDir, ts.sys.fileExists, "tsconfig.json");
    if (!configPath) {
        throw new Error("Could not find tsconfig.json");
    }
    const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
    const { options, fileNames } = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(configPath));
    // Create program
    const program = ts.createProgram(fileNames, options);
    const fixer = createImportFixer(program);
    // Process each source file
    for (const sourceFile of program.getSourceFiles()) {
        // Skip declaration files and node_modules
        if (sourceFile.isDeclarationFile || sourceFile.fileName.includes("node_modules")) {
            continue;
        }
        console.log(`Processing ${sourceFile.fileName}...`);
        // Fix imports in the file
        const result = fixer.fixImportPaths(sourceFile);
        // Get the transformed source
        const printer = ts.createPrinter();
        const transformedSource = printer.printFile(result.transformed[0]);
        // Write the changes back to the file
        await fs.promises.writeFile(sourceFile.fileName, transformedSource, "utf8");
    }
}
// Main execution
async function main() {
    try {
        console.log("Starting import path fixing process...");
        await fixImports(process.cwd());
        console.log("Import paths fixed successfully!");
    }
    catch (error) {
        console.error("Error fixing imports:", error);
        process.exit(1);
    }
}
main();
