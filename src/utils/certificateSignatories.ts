export interface CertificateSignatoriesConfig {
  signatory1Name: string;
  signatory1TitleEn: string;
  signatory1TitleSw: string;
  signatory1Org: string;
  signatory2Name: string;
  signatory2TitleEn: string;
  signatory2TitleSw: string;
  signatory2Org: string;
  lastUpdated?: string;
  updatedBy?: string;
}

export const DEFAULT_CERTIFICATE_SIGNATORIES: CertificateSignatoriesConfig = {
  signatory1Name: 'Amina Ntsiki Bedzengah',
  signatory1TitleEn: 'KFE Program Coordinator',
  signatory1TitleSw: 'Mratibu wa Miradi KFE',
  signatory1Org: 'KFE Programs & Civic Education Directorate',
  signatory2Name: 'Mesalim Ali Rambo',
  signatory2TitleEn: 'KFE Executive Director',
  signatory2TitleSw: 'Mkurugenzi Mtendaji KFE',
  signatory2Org: 'Kwale Focus Empowerment Executive Office',
};

const SIGNATORIES_STORAGE_KEY = 'the_samaritan_cert_signatories_v1';

export function getCertificateSignatories(): CertificateSignatoriesConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_CERTIFICATE_SIGNATORIES;
  }
  try {
    const raw = localStorage.getItem(SIGNATORIES_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_CERTIFICATE_SIGNATORIES;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CERTIFICATE_SIGNATORIES,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to parse certificate signatories:', err);
    return DEFAULT_CERTIFICATE_SIGNATORIES;
  }
}

export function saveCertificateSignatories(
  config: CertificateSignatoriesConfig,
  updatedBy?: string
): CertificateSignatoriesConfig {
  if (typeof window === 'undefined') {
    return config;
  }
  try {
    const updated: CertificateSignatoriesConfig = {
      ...config,
      lastUpdated: new Date().toISOString(),
      updatedBy: updatedBy || 'Executive Administrator',
    };
    localStorage.setItem(SIGNATORIES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('the_samaritan_signatories_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Failed to save certificate signatories:', err);
    return config;
  }
}

export function resetCertificateSignatories(): CertificateSignatoriesConfig {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SIGNATORIES_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent('the_samaritan_signatories_updated', {
        detail: DEFAULT_CERTIFICATE_SIGNATORIES,
      })
    );
  }
  return DEFAULT_CERTIFICATE_SIGNATORIES;
}
