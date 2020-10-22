import { renderTemplate } from '../template';
import { readFile } from '../fs-async';
import Handlebars from 'handlebars';

const readFileMock = (readFile as any) as jest.Mock;
const hbsCompileMock = (Handlebars.compile as any) as jest.Mock;

jest.mock('../fs-async', () => ({ readFile: jest.fn() }));
jest.mock('handlebars', () => ({ compile: jest.fn() }));
jest.mock('path');

describe('Template utilities', () => {
  beforeEach(() => {
    readFileMock.mockClear();
    hbsCompileMock.mockClear();
  });

  test('`renderTemplate` correctly reads the expected template content from the filesystem and passes it to `Handlebars.compile`', async () => {
    const filename = 'my-template.hbs';
    const template = '::template::';
    const templateFn = () => '::rendered::';
    const context = { foo: 'bar' };

    readFileMock.mockImplementation(async () => template);
    hbsCompileMock.mockImplementation(() => templateFn);

    expect(await renderTemplate(filename, context)).toBe(templateFn());

    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(readFileMock).toHaveBeenCalledWith(
      '/root/src/utils/my-template.hbs',
      'utf8'
    );

    expect(hbsCompileMock).toHaveBeenCalledTimes(1);
    expect(hbsCompileMock).toHaveBeenCalledWith(template);
  });
});