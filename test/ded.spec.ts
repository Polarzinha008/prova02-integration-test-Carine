import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('D&D Combat API - Testes de Integração', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://dnd-combat-api-7f3660dcecb1.herokuapp.com';
  const monster = 'goblin';

  // 👉 Configura o reporter
  beforeAll(() => {
    p.reporter.add(rep);
  });

  // =========================
  // 🧍 TESTES DE PERSONAGEM
  // =========================
  describe('Character', () => {

    it('Deve obter um personagem de exemplo', async () => {
      console.log('🔍 Buscando personagem de exemplo...');

      await p
        .spec()
        .get(`${baseUrl}/api/characters/example`)
        .expectStatus(StatusCodes.OK);

      console.log('✅ Personagem obtido com sucesso\n');
    });

    it('Deve validar um personagem corretamente', async () => {
      console.log('🧪 Validando personagem válido...');

      const response = await p
        .spec()
        .post(`${baseUrl}/api/characters/check`)
        .withJson({
          name: "Kaya",
          strength: 10,
          dexterity: 7,
          hitPoints: 11,
          armorClass: 12
        })
        .expectStatus(StatusCodes.OK)
        .returns('res');

      console.log('📦 Resposta:', response.body);
      console.log('✅ Personagem válido\n');
    });

    it('Deve retornar erro ao enviar atributos zerados', async () => {
      console.log('⚠️ Testando personagem inválido (atributos 0)...');

      await p
        .spec()
        .post(`${baseUrl}/api/characters/check`)
        .withJson({
          name: "Kaya",
          strength: 0,
          dexterity: 0,
          hitPoints: 0,
          armorClass: 0
        })
        .expectStatus(StatusCodes.BAD_REQUEST);

      console.log('❌ Erro retornado corretamente\n');
    });

  });

  // =========================
  // ⚔️ TESTES DE BATALHA
  // =========================
  describe('Battle', () => {

    it('Deve retornar erro ao tentar batalhar com personagem inválido', async () => {
      console.log('⚠️ Iniciando batalha com personagem inválido...');

      await p
        .spec()
        .post(`${baseUrl}/api/battle/${monster}`)
        .withJson({
          name: "Kaya",
          strength: 0,
          dexterity: 0,
          hitPoints: 0,
          armorClass: 0
        })
        .expectStatus(StatusCodes.BAD_REQUEST);

      console.log('❌ API rejeitou corretamente\n');
    });

    it('Deve simular uma batalha contra goblin e mostrar resultado', async () => {
      console.log(`⚔️ Iniciando batalha contra ${monster}...`);

      const response = await p
        .spec()
        .post(`${baseUrl}/api/battle/${monster}`)
        .withJson({
          name: "Kaya",
          strength: 10,
          dexterity: 7,
          hitPoints: 11,
          armorClass: 12
        })
        .withRequestTimeout(10000)
        .expectStatus(StatusCodes.OK)
        .returns('res.body');

      console.log('📦 Resposta completa:', response);

      // 👉 Valida estrutura
      expect(response).toHaveProperty('winner');
      expect(response).toHaveProperty('finalMessage');
      expect(response).toHaveProperty('rounds');

      const ganhou = response.winner === "Kaya";

      console.log('🏆 Vencedor:', response.winner);
      console.log('📜 Mensagem final:', response.finalMessage);
      console.log('🔢 Rodadas:', response.rounds);

      // 👉 Mostrar log da batalha (top pra apresentação 👀)
      console.log('\n📖 LOG DA BATALHA:');
      response.battleLog.forEach((linha, index) => {
        console.log(`${index + 1}. ${linha}`);
      });

      console.log(
        '\n🎯 Resultado final:',
        ganhou ? 'Vitória 🎉' : 'Derrota 💀'
      );

      console.log('=====================================\n');
    });

  });

});