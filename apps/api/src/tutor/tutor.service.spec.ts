import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TutorService } from './tutor.service';
import { GoogleGenAI } from '@google/genai';
import { MsEdgeTTS } from 'msedge-tts';

// Mock external SDKs
jest.mock('@google/genai');
jest.mock('msedge-tts');

describe('TutorService', () => {
  let service: TutorService;
  let mockGoogleGenAI: any;
  let mockMsEdgeTTS: any;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'GEMINI_API_KEY') return 'test-gemini-key';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TutorService>(TutorService);

    mockGoogleGenAI = GoogleGenAI as jest.MockedClass<typeof GoogleGenAI>;
    mockMsEdgeTTS = MsEdgeTTS as jest.MockedClass<typeof MsEdgeTTS>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processChat', () => {
    it('should successfully call Gemini and Edge TTS to process a chat turn', async () => {
      // Mock Gemini SDK response matching the TutorResponse schema
      const mockGeminiResponse = {
        text: JSON.stringify({
          userTranscript: 'Hello world',
          correctedTranscript: 'Hello world',
          corrections: [],
          vocabularySuggestions: [],
          pronunciationTips: [],
          tutorText: 'Hello! Welcome to your language class.',
        }),
      };

      const mockGenerateContent = jest.fn().mockResolvedValue(mockGeminiResponse);
      const mockModels = {
        generateContent: mockGenerateContent,
      };

      mockGoogleGenAI.mockImplementation(() => {
        return {
          models: mockModels,
        } as any;
      });

      // Mock MsEdgeTTS audio streaming
      const mockAudioStream = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from('fake-mp3-bytes'));
          }
          if (event === 'end') {
            callback();
          }
          return mockAudioStream;
        }),
      };

      mockMsEdgeTTS.mockImplementation(() => {
        return {
          setMetadata: jest.fn().mockResolvedValue(undefined),
          toStream: jest.fn().mockReturnValue({ audioStream: mockAudioStream }),
        } as any;
      });

      const request = {
        audioBase64: 'fake-base64',
        mimeType: 'audio/webm',
        history: [],
        mode: 'casual' as const,
      };

      const result = await service.processChat(request);

      expect(result).toBeDefined();
      expect(result.userTranscript).toBe('Hello world');
      expect(result.tutorText).toBe('Hello! Welcome to your language class.');
      expect(result.audioBase64).toBe(Buffer.from('fake-mp3-bytes').toString('base64'));
      expect(mockGenerateContent).toHaveBeenCalled();
    });

    it('should throw BadRequestException if Gemini API key is missing', async () => {
      const mockEmptyConfigService = {
        get: jest.fn().mockReturnValue(undefined),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TutorService,
          { provide: ConfigService, useValue: mockEmptyConfigService },
        ],
      }).compile();

      const localService = module.get<TutorService>(TutorService);

      await expect(
        localService.processChat({
          audioBase64: 'fake-base64',
          mimeType: 'audio/webm',
          history: [],
          mode: 'casual',
        })
      ).rejects.toThrow('Gemini API key is required');
    });
  });

  describe('evaluateSession', () => {
    it('should successfully call Gemini to evaluate conversation history', async () => {
      const mockEvaluationResponse = {
        text: JSON.stringify({
          fluencyScore: 8,
          vocabularyScore: 7.5,
          grammarScore: 8,
          pronunciationScore: 7,
          overallBand: 7.5,
          feedbackSummary: 'Great job!',
          commonMistakes: ['using simple vocabulary'],
          exampleImprovements: [],
        }),
      };

      const mockGenerateContent = jest.fn().mockResolvedValue(mockEvaluationResponse);
      const mockModels = {
        generateContent: mockGenerateContent,
      };

      mockGoogleGenAI.mockImplementation(() => {
        return {
          models: mockModels,
        } as any;
      });

      const history = [
        { role: 'user' as const, text: 'Hello' },
        { role: 'tutor' as const, text: 'Hi, how can I help you today?' },
      ];

      const result = await service.evaluateSession(history, 'casual');

      expect(result).toBeDefined();
      expect(result.overallBand).toBe(7.5);
      expect(result.fluencyScore).toBe(8);
      expect(mockGenerateContent).toHaveBeenCalled();
    });
  });
});
