import tailorsData from './tailors.json';

export const cities = [
  {
    slug: 'warszawa', name: 'Warszawa', description: 'Stolica i największe miasto Polski',
    intro: 'Szukasz krawca w Warszawie? Nasz katalog obejmuje pracownie krawieckie i krawców z całej Warszawy — od Ursynowa i Mokotowa po Śródmieście i Pragę. Niezależnie czy potrzebujesz szycia na miarę, przeróbki odzieży czy drobnej naprawy, znajdziesz tu sprawdzonego specjalistę blisko siebie.',
  },
  {
    slug: 'krakow', name: 'Kraków', description: 'Dawna stolica królewska',
    intro: 'Kraków to miasto z bogatą tradycją rzemiosła i krawiectwa. W naszym katalogu znajdziesz krawców i pracownie krawieckie z całego Krakowa — od Starego Miasta po Nową Hutę i Krowodrze. Szycie na miarę, poprawki, przeróbki odzieży — wszystko w jednym miejscu.',
  },
  {
    slug: 'wroclaw', name: 'Wrocław', description: 'Miasto stu mostów',
    intro: 'Wrocław oferuje szeroki wybór pracowni krawieckich i doświadczonych krawców. Przeglądaj oferty z całego Wrocławia — centrum, Krzyki, Fabryczna, Psie Pole. Znajdź kogoś, kto zadba o Twoją garderobę profesjonalnie i w dobrej cenie.',
  },
  {
    slug: 'gdansk', name: 'Gdańsk', description: 'Perła Bałtyku',
    intro: 'Szukasz krawca w Gdańsku? Nasz katalog zawiera pracownie krawieckie z Gdańska i okolic Trójmiasta. Od Wrzeszcza po Oliwę — znajdź krawca, który zajmie się szyciem na miarę, przeróbkami lub naprawą odzieży.',
  },
  {
    slug: 'lodz', name: 'Łódź', description: 'Miasto włókiennictwa i mody',
    intro: 'Łódź ma bogatą tradycję włókienniczą i modową, a jej krawcy kontynuują to dziedzictwo. W katalogu znajdziesz pracownie krawieckie z całej Łodzi — Śródmieście, Widzew, Bałuty, Górna. Szycie na miarę i przeróbki odzieży w mieście mody.',
  },
  {
    slug: 'poznan', name: 'Poznań', description: 'Miasto targów i koziołków',
    intro: 'W Poznaniu działa wiele znakomitych pracowni krawieckich. Przeglądaj oferty krawców z całego Poznania — Jeżyce, Grunwald, Stare Miasto, Nowe Miasto. Niezależnie od potrzeby — szycie garniturów, sukienek, poprawki czy przeróbki — znajdziesz tu odpowiedniego specjalistę.',
  },
  {
    slug: 'katowice', name: 'Katowice', description: 'Serce Górnego Śląska',
    intro: 'Katowice i Górny Śląsk mają długą tradycję rzemiosła. W naszym katalogu znajdziesz krawców i pracownie krawieckie w Katowicach — centrum, Ligota, Janów. Profesjonalne szycie na miarę i przeróbki odzieży w sercu Śląska.',
  },
  {
    slug: 'lublin', name: 'Lublin', description: 'Stolica wschodniej Polski',
    intro: 'Szukasz krawca w Lublinie? Nasz katalog zawiera pracownie krawieckie i krawców z całego Lublina. Od Śródmieścia po LSM i Czuby — znajdź kogoś, kto zajmie się Twoją garderobą. Szycie na miarę i przeróbki odzieży w stolicy wschodniej Polski.',
  },
  {
    slug: 'szczecin', name: 'Szczecin', description: 'Miasto nad Odrą i Bałtykiem',
    intro: 'Szczecin oferuje szeroki wybór pracowni krawieckich. W naszym katalogu znajdziesz krawców z całego Szczecina — centrum, Prawobrzeże, Pogodno. Profesjonalne szycie na miarę, przeróbki i naprawy odzieży nad Odrą.',
  },
  {
    slug: 'bydgoszcz', name: 'Bydgoszcz', description: 'Miasto nad Brdą i Kanałem Bydgoskim',
    intro: 'Szukasz krawca w Bydgoszczy? W katalogu znajdziesz pracownie krawieckie i krawców z całej Bydgoszczy. Od centrum po Fordon i Wyżyny — sprawdzeni specjaliści od szycia na miarę i przeróbek odzieży.',
  },
  {
    slug: 'bialystok', name: 'Białystok', description: 'Stolica Podlasia',
    intro: 'Szukasz krawca w Białymstoku? Nasz katalog zawiera pracownie krawieckie i krawców z całego Białegostoku. Szycie na miarę, przeróbki i naprawy odzieży w stolicy Podlasia.',
  },
  {
    slug: 'rzeszow', name: 'Rzeszów', description: 'Stolica Podkarpacia',
    intro: 'Rzeszów to dynamicznie rozwijające się miasto z wieloma sprawdzonymi krawcami. W katalogu znajdziesz pracownie krawieckie z całego Rzeszowa. Profesjonalne szycie na miarę i przeróbki odzieży w stolicy Podkarpacia.',
  },
  {
    slug: 'torun', name: 'Toruń', description: 'Miasto Kopernika nad Wisłą',
    intro: 'Szukasz krawca w Toruniu? Nasz katalog zawiera krawców i pracownie krawieckie z całego Torunia. Od Starówki po Rubinkowo — znajdź specjalistę od szycia na miarę i przeróbek odzieży.',
  },
  {
    slug: 'kielce', name: 'Kielce', description: 'Stolica Świętokrzyskiego',
    intro: 'Szukasz krawca w Kielcach? W katalogu znajdziesz pracownie krawieckie i krawców z całych Kielc. Szycie na miarę, przeróbki i naprawy odzieży w sercu województwa świętokrzyskiego.',
  },
  {
    slug: 'czestochowa', name: 'Częstochowa', description: 'Miasto Jasnej Góry',
    intro: 'Szukasz krawca w Częstochowie? Nasz katalog zawiera sprawdzonych krawców i pracownie krawieckie z całej Częstochowy. Profesjonalne szycie na miarę i przeróbki odzieży w mieście Jasnej Góry.',
  },
  {
    slug: 'radom', name: 'Radom', description: 'Miasto w sercu Mazowsza',
    intro: 'Szukasz krawca w Radomiu? W katalogu znajdziesz pracownie krawieckie i krawców z całego Radomia. Szycie na miarę, przeróbki i naprawy odzieży w sercu Mazowsza.',
  },
];

export const tailors = tailorsData;
