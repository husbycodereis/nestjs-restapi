import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditDto } from 'src/user/dto/edit-user.dto';

//to connect test db : run this command to start prisma server
// npx dotenv -e .env.test -- prisma studio
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3001);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3001');
  });
  afterAll(() => {
    app.close();
  });
  const dto: AuthDto = {
    email: 'test@test.com',
    password: '1234',
  };

  describe('Auth', () => {
    describe('signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: '1234' })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: 'test@test.com' })
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });
    describe('signin', () => {
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('token', 'access_token');
      });
    });
  });
  describe('User', () => {
    const dto: EditDto = {
      email: 'floki@floki.com',
      firstName: 'floki',
      lastName: 'hinzie',
    };
    describe('get users', () => {
      it('should get users', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .inspect()
          .expectStatus(200);
      });
    });
    describe('edit user', () => {
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .inspect();
      });
    });
  });
  describe('Bookmarks', () => {
    describe('Create Bookmark', () => {});
    describe('Get Bookmarks', () => {});
    describe('Get Bookmark by id', () => {});
    describe('Edit Bookmark', () => {});
    describe('Delete Bookmark', () => {});
  });
});
