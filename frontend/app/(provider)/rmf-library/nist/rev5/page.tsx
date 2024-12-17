'use client';

import { NISTFrameworkRev5 } from '../NISTFrameworkRev5';

export default function NISTRev5Page() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">NIST SP 800-53 Rev. 5</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Browse and search the complete NIST SP 800-53 Revision 5 security controls catalog
        </p>
      </div>
      <NISTFrameworkRev5 />
    </div>
  );
}
