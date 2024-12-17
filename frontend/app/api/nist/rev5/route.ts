import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'framework_storage', 'nist', 'NIST_SP-800-53_rev5_catalog_load.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const result = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true
    });

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error reading NIST Rev5 catalog:', error);
    return NextResponse.json(
      { error: 'Failed to load NIST Rev5 catalog' },
      { status: 500 }
    );
  }
}
