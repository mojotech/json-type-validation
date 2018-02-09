import {
  Decoder,
  string,
  number,
  constant,
  constantTrue,
  constantFalse,
  object,
  array,
  optional,
  oneOf,
  union
} from '../src/index';

describe('decode phone number objects', () => {
  enum PhoneUse {
    Mobile = 'Mobile',
    Home = 'Home',
    Work = 'Work'
  }

  interface PhoneNumber {
    id: number;
    use?: PhoneUse;
  }

  interface InternationalPhone extends PhoneNumber {
    international: true;
    rawNumber: string;
  }

  interface DomesticPhone extends PhoneNumber {
    international: false;
    areaCode: string;
    prefix: string;
    lineNumber: string;
  }

  type Phone = DomesticPhone | InternationalPhone;

  const phoneUseDecoder: Decoder<PhoneUse> = oneOf(
    constant(PhoneUse.Mobile),
    constant(PhoneUse.Home),
    constant(PhoneUse.Work)
  );

  const internationalPhoneDecoder: Decoder<InternationalPhone> = object({
    id: number(),
    use: optional(phoneUseDecoder),
    international: constantTrue(),
    rawNumber: string()
  });

  const domesticPhoneDecoder: Decoder<DomesticPhone> = object({
    id: number(),
    use: optional(phoneUseDecoder),
    international: constantFalse(),
    areaCode: string(),
    prefix: string(),
    lineNumber: string()
  });

  const phoneDecoder: Decoder<Phone> = union(domesticPhoneDecoder, internationalPhoneDecoder);

  const phonesDecoder: Decoder<Phone[]> = array(phoneDecoder);

  it('can decode both international and domestic phones', () => {
    const json = [
      {
        id: 1,
        use: 'Work',
        international: false,
        areaCode: '123',
        prefix: '456',
        lineNumber: '7890'
      },
      {
        id: 2,
        use: 'Work',
        international: true,
        rawNumber: '111234567890'
      },
      {
        id: 3,
        international: false,
        areaCode: '000',
        prefix: '000',
        lineNumber: '5555'
      }
    ];

    expect(phonesDecoder.run(json)).toEqual({ok: true, result: json});
  });

  it('fails when an object is neither an international or domestic phone', () => {
    const json = [
      {
        id: 1,
        use: 'Work',
        international: false,
        areaCode: '123',
        prefix: '456',
        lineNumber: '7890'
      },
      {
        id: 5
      }
    ];

    const error = phonesDecoder.run(json);
    expect(error).toMatchObject({
      ok: false,
      error: {
        at: 'input[1]',
        message: [
          'expected a value matching one of the decoders, got the errors ',
          `["at input: the key 'international' is required but was not present", `,
          `"at input: the key 'international' is required but was not present"]`
        ].join('')
      }
    });
  });
});
