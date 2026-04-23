const resources = {
  en: {
    common: {
      appName: 'GymBro Analytics',
      language: {
        english: 'EN',
        russian: 'RU',
        selector: 'Language selector',
        switchToEnglish: 'Switch language to English',
        switchToRussian: 'Switch language to Russian',
      },
      actions: {
        logout: 'Logout',
        close: 'Close',
      },
      states: {
        error: 'Error',
      },
      fallback: {
        unknown: 'Unknown',
      },
      units: {
        ms: 'ms',
      },
    },
    auth: {
      pageTitle: 'GymBro Admin Login',
      loading: 'Loading Auth...',
      accessDeniedAlert: 'Access denied. You must be an administrator.',
      login: {
        title: 'GymBro Admin',
        emailPlaceholder: 'Email',
        passwordPlaceholder: 'Password',
        submit: 'Login to Dashboard',
        errors: {
          notAdmin: 'Access Denied. You are not an administrator.',
          invalidCredentials: 'Login failed. Check credentials.',
        },
      },
    },
    dashboard: {
      pageTitle: 'GymBro Analytics Dashboard',
      title: 'GymBro Analytics',
      headerFallback: 'Dashboard',
      navigation: {
        overview: 'Overview',
        telemetry: 'Telemetry',
        demographics: 'Segment Analysis',
        system: 'System',
      },
      loading: 'Loading Analytics Data...',
      loadFailed: 'Failed to load reports.',
      filters: {
        startDate: 'Start Date',
        endDate: 'End Date',
        granularity: 'Granularity',
        options: {
          hour: 'Hour',
          day: 'Day',
          week: 'Week',
          month: 'Month',
        },
      },
      overview: {
        totalEngagements: 'Engagements Today',
        onboardedUsers: 'Onboarded Users',
        todayDau: 'Today DAU',
        recentApiErrors: 'Recent API Errors',
        charts: {
          dau: 'Daily Active Users (DAU)',
          funnel: 'Global Onboarding Funnel',
        },
        errors: {
          dau: 'Failed to load DAU data.',
          onboarding: 'Failed to load onboarding data.',
        },
        funnel: {
          appInstalled: 'App Installed',
          registered: 'Registered',
          onboarding: 'Onboarding',
          createdPet: 'Created Pet',
        },
      },
      telemetry: {
        charts: {
          hourly: 'Hourly Activity Flow (Tallinn Time)',
          breakdown: 'Telemetry Event Breakdown',
          sleep: 'Sleep Telemetry',
        },
        errors: {
          hourly: 'Failed to load hourly activity.',
          breakdown: 'Failed to load telemetry data.',
          sleep: 'Failed to load sleep telemetry data.',
        },
        empty: {
          breakdown: 'No telemetry events recorded yet.',
          sleep: 'No sleep telemetry data available yet.',
        },
      },
      demographics: {
        usageOverview: {
          title: 'Usage Overview',
          description: 'Global request activity for the selected date range.',
          error: 'Failed to load usage summary data.',
          metrics: {
            totalRequests: {
              title: 'Total Requests',
              subtitle: 'Selected date range',
            },
            activeUsers: {
              title: 'Active Users',
              subtitle: 'Non-admin requesters',
            },
            avgRequestsPerUser: {
              title: 'Avg Requests per User',
              subtitle: 'Across active users',
            },
            avgTokens: {
              title: 'Avg Tokens',
              subtitle: 'Per request',
            },
            avgResponseTime: {
              title: 'Avg Response Time',
              subtitle: 'Per request',
            },
          },
        },
        userDistribution: {
          title: 'User Distribution',
          description: 'How users are distributed across the available demographic categories.',
          charts: {
            age: 'Users by Age Group',
            gender: 'Users by Gender',
            weight: 'Users by Weight',
            height: 'Users by Height',
          },
          errors: {
            age: 'Failed to load age group distribution.',
            gender: 'Failed to load gender distribution.',
            weight: 'Failed to load weight distribution.',
            height: 'Failed to load height distribution.',
          },
          empty: {
            age: 'No age group distribution available yet.',
            gender: 'No gender distribution available yet.',
            weight: 'No weight distribution available yet.',
            height: 'No height distribution available yet.',
          },
        },
        segmentComparison: {
          title: 'Segment Comparison',
          description: 'A direct comparison of usage differences between the most and least active demographic segments.',
          error: 'Failed to load segment comparison data.',
          empty: 'Not enough segment data for comparison yet.',
          labels: {
            topSegment: 'Top segment',
            bottomSegment: 'Bottom segment',
            metric: 'Metric',
            gap: 'Gap',
            differencePercent: 'Difference %',
              allSegments: 'All segments',
          },
          dimensions: {
            age: 'Age',
            gender: 'Gender',
            weight: 'Weight',
            height: 'Height',
          },
          metrics: {
            requests_count: 'Requests',
            avg_requests: 'Avg Requests',
          },
          summary: '{{top}} outperformed {{bottom}} by {{percent}}% in the selected period.',
        },
        usageBySegment: {
          title: 'Usage by Segment',
          description: 'How request volume differs across the same demographic groups.',
          charts: {
            age: 'Usage by Age Group',
            gender: 'Requests by Gender',
            weight: 'Requests by Weight',
            height: 'Requests by Height',
          },
          errors: {
            age: 'Failed to load age group analytics.',
            gender: 'Failed to load gender insights data.',
            weight: 'Failed to load weight insights data.',
            height: 'Failed to load height insights data.',
          },
          empty: {
            age: 'No age group analytics available yet.',
            gender: 'No gender data available.',
            weight: 'No weight data available.',
            height: 'No height data available.',
          },
        },
      },
      system: {
        charts: {
          aiHealth: 'AI Provider Health',
          requestsOverTime: 'Requests Over Time',
        },
        errors: {
          aiHealth: 'Failed to load AI health data.',
          activityTimeline: 'Failed to load activity timeline.',
        },
        empty: {
          activityTimeline: 'No activity data available for this range.',
        },
      },
      modal: {
        onboardedUsers: {
          title: 'Onboarded Users',
          searchPlaceholder: 'Search by email...',
          loading: 'Loading onboarded users...',
          error: 'Failed to load onboarded users.',
          empty: 'No onboarded users found.',
          noMatches: 'No matching onboarded users found.',
        },
        dauToday: {
          title: 'DAU Today',
          searchPlaceholder: 'Search by email or name...',
          loading: 'Loading DAU data...',
          error: 'Failed to load DAU data.',
          empty: 'No users active today.',
          noMatches: 'No matching users found.',
        },
        interactionsToday: {
          title: 'Total Interactions Today',
          searchPlaceholder: 'Search by email or details...',
          loading: 'Loading interactions data...',
          error: 'Failed to load interactions.',
          empty: 'No interactions today.',
          noMatches: 'No matching interactions found.',
        },
      },
      tooltips: {
        usageMetrics: {
          requests: 'Requests',
          avgTokens: 'Avg Tokens',
          avgResponseTime: 'Avg Response Time',
        },
      },
      chartSeries: {
        activeUsers: 'Active Users',
        aiSuccess: 'AI Success',
        telemetryEvents: 'Telemetry Events',
        count: 'Count',
        users: 'Users',
        requests: 'Requests',
        avgRequests: 'Avg Requests',
        success: 'Success',
        rateLimited: 'Rate Limited',
        providerErrors: 'Provider Errors',
        activity: 'Activity',
      },
      values: {
        ageGroups: {
          lt18: '<18',
          from18to24: '18-24',
          from25to34: '25-34',
          from35to44: '35-44',
          from45to54: '45-54',
          from55Plus: '55+',
        },
        gender: {
          female: 'Female',
          male: 'Male',
          other: 'Other',
        },
        weightBuckets: {
          lt60: '<60',
          from60to75: '60-75',
          from75to90: '75-90',
          from90Plus: '90+',
        },
        heightBuckets: {
          lt160: '<160',
          from160to175: '160-175',
          from175to190: '175-190',
          from190Plus: '190+',
        },
      },
      eventTypes: {
        appStarted: 'App started',
        authLoginSuccess: 'Login success',
        authRegisterSuccess: 'Registration success',
        onboardingStarted: 'Onboarding started',
        onboardingPetCreated: 'Pet created',
        mealLogged: 'Meal logged',
        mealDeleted: 'Meal deleted',
        trainingLogged: 'Training logged',
        trainingDeleted: 'Training deleted',
        aiRequestStarted: 'AI request started',
        aiRequestCompleted: 'AI request completed',
        aiRequestFailed: 'AI request failed',
        aiRateLimited: 'AI rate limited',
        aiProviderFailed: 'AI provider failed',
        sleepPermissionRequested: 'Sleep permission requested',
        sleepPermissionGranted: 'Sleep permission granted',
        sleepPermissionDenied: 'Sleep permission denied',
        sleepSyncStarted: 'Sleep sync started',
        sleepSyncCompleted: 'Sleep sync completed',
        sleepSyncFailed: 'Sleep sync failed',
      },
    },
  },
  ru: {
    common: {
      appName: 'GymBro Analytics',
      language: {
        english: 'EN',
        russian: 'RU',
        selector: 'Переключатель языка',
        switchToEnglish: 'Переключить язык на английский',
        switchToRussian: 'Переключить язык на русский',
      },
      actions: {
        logout: 'Выйти',
        close: 'Закрыть',
      },
      states: {
        error: 'Ошибка',
      },
      fallback: {
        unknown: 'Неизвестно',
      },
      units: {
        ms: 'мс',
      },
    },
    auth: {
      pageTitle: 'Вход администратора GymBro',
      loading: 'Проверка авторизации...',
      accessDeniedAlert: 'Доступ запрещен. Требуются права администратора.',
      login: {
        title: 'Админка GymBro',
        emailPlaceholder: 'Email',
        passwordPlaceholder: 'Пароль',
        submit: 'Войти в дашборд',
        errors: {
          notAdmin: 'Доступ запрещен. Вы не являетесь администратором.',
          invalidCredentials: 'Не удалось войти. Проверьте учетные данные.',
        },
      },
    },
    dashboard: {
      pageTitle: 'Аналитическая панель GymBro',
      title: 'GymBro Analytics',
      headerFallback: 'Панель',
      navigation: {
        overview: 'Обзор',
        telemetry: 'Телеметрия',
        demographics: 'Анализ сегментов',
        system: 'Система',
      },
      loading: 'Загрузка аналитики...',
      loadFailed: 'Не удалось загрузить отчеты.',
      filters: {
        startDate: 'Начальная дата',
        endDate: 'Конечная дата',
        granularity: 'Группировка',
        options: {
          hour: 'Час',
          day: 'День',
          week: 'Неделя',
          month: 'Месяц',
        },
      },
      overview: {
        totalEngagements: 'Взаимодействия (сегодня)',
        onboardedUsers: 'Пользователи с онбордингом',
        todayDau: 'DAU за сегодня',
        recentApiErrors: 'Недавние ошибки API',
        charts: {
          dau: 'Ежедневно активные пользователи (DAU)',
          funnel: 'Глобальная воронка онбординга',
        },
        errors: {
          dau: 'Не удалось загрузить данные DAU.',
          onboarding: 'Не удалось загрузить данные онбординга.',
        },
        funnel: {
          appInstalled: 'Приложение установлено',
          registered: 'Зарегистрировались',
          onboarding: 'Онбординг',
          createdPet: 'Создали питомца',
        },
      },
      telemetry: {
        charts: {
          hourly: 'Почасовая активность (время Таллинна)',
          breakdown: 'Разбивка событий телеметрии',
          sleep: 'Телеметрия сна',
        },
        errors: {
          hourly: 'Не удалось загрузить почасовую активность.',
          breakdown: 'Не удалось загрузить телеметрию.',
          sleep: 'Не удалось загрузить телеметрию сна.',
        },
        empty: {
          breakdown: 'События телеметрии пока отсутствуют.',
          sleep: 'Данные телеметрии сна пока отсутствуют.',
        },
      },
      demographics: {
        usageOverview: {
          title: 'Обзор использования',
          description: 'Общая активность запросов за выбранный диапазон дат.',
          error: 'Не удалось загрузить сводку использования.',
          metrics: {
            totalRequests: {
              title: 'Всего запросов',
              subtitle: 'Выбранный период',
            },
            activeUsers: {
              title: 'Активные пользователи',
              subtitle: 'Пользователи без админов',
            },
            avgRequestsPerUser: {
              title: 'Среднее запросов на пользователя',
              subtitle: 'Среди активных пользователей',
            },
            avgTokens: {
              title: 'Среднее токенов',
              subtitle: 'На один запрос',
            },
            avgResponseTime: {
              title: 'Среднее время ответа',
              subtitle: 'На один запрос',
            },
          },
        },
        userDistribution: {
          title: 'Распределение пользователей',
          description: 'Как пользователи распределяются по доступным демографическим категориям.',
          charts: {
            age: 'Пользователи по возрастным группам',
            gender: 'Пользователи по полу',
            weight: 'Пользователи по весу',
            height: 'Пользователи по росту',
          },
          errors: {
            age: 'Не удалось загрузить распределение по возрасту.',
            gender: 'Не удалось загрузить распределение по полу.',
            weight: 'Не удалось загрузить распределение по весу.',
            height: 'Не удалось загрузить распределение по росту.',
          },
          empty: {
            age: 'Распределение по возрастным группам пока недоступно.',
            gender: 'Распределение по полу пока недоступно.',
            weight: 'Распределение по весу пока недоступно.',
            height: 'Распределение по росту пока недоступно.',
          },
        },
        segmentComparison: {
          title: 'Сравнение сегментов',
          description: 'Прямое сравнение различий в использовании между наиболее и наименее активными демографическими сегментами.',
          error: 'Не удалось загрузить сравнение сегментов.',
          empty: 'Пока недостаточно данных для сравнения сегментов.',
          labels: {
            topSegment: 'Лучший сегмент',
            bottomSegment: 'Нижний сегмент',
            metric: 'Метрика',
            gap: 'Разрыв',
            differencePercent: 'Разница %',
              allSegments: 'Все сегменты',
          },
          dimensions: {
            age: 'Возраст',
            gender: 'Пол',
            weight: 'Вес',
            height: 'Рост',
          },
          metrics: {
            requests_count: 'Запросы',
            avg_requests: 'Среднее запросов',
          },
          summary: '{{top}} опережает {{bottom}} на {{percent}}% за выбранный период.',
        },
        usageBySegment: {
          title: 'Использование по сегментам',
          description: 'Как различается объем запросов в этих же демографических группах.',
          charts: {
            age: 'Использование по возрастным группам',
            gender: 'Запросы по полу',
            weight: 'Запросы по весу',
            height: 'Запросы по росту',
          },
          errors: {
            age: 'Не удалось загрузить аналитику по возрастным группам.',
            gender: 'Не удалось загрузить данные по полу.',
            weight: 'Не удалось загрузить данные по весу.',
            height: 'Не удалось загрузить данные по росту.',
          },
          empty: {
            age: 'Аналитика по возрастным группам пока недоступна.',
            gender: 'Данные по полу недоступны.',
            weight: 'Данные по весу недоступны.',
            height: 'Данные по росту недоступны.',
          },
        },
      },
      system: {
        charts: {
          aiHealth: 'Состояние AI-провайдера',
          requestsOverTime: 'Запросы во времени',
        },
        errors: {
          aiHealth: 'Не удалось загрузить данные о состоянии AI.',
          activityTimeline: 'Не удалось загрузить временную шкалу активности.',
        },
        empty: {
          activityTimeline: 'Для выбранного диапазона данные активности отсутствуют.',
        },
      },
      modal: {
        onboardedUsers: {
          title: 'Пользователи с онбордингом',
          searchPlaceholder: 'Поиск по email...',
          loading: 'Загрузка пользователей с онбордингом...',
          error: 'Не удалось загрузить пользователей с онбордингом.',
          empty: 'Пользователи с онбордингом не найдены.',
          noMatches: 'Совпадающие пользователи не найдены.',
        },
        dauToday: {
          title: 'DAU сегодня',
          searchPlaceholder: 'Поиск по email или имени...',
          loading: 'Загрузка данных DAU...',
          error: 'Не удалось загрузить данные DAU.',
          empty: 'Нет активных пользователей сегодня.',
          noMatches: 'Подходящих пользователей не найдено.',
        },
        interactionsToday: {
          title: 'Всего взаимодействий сегодня',
          searchPlaceholder: 'Поиск по email или деталям...',
          loading: 'Загрузка данных о взаимодействиях...',
          error: 'Не удалось загрузить взаимодействия.',
          empty: 'Сегодня нет взаимодействий.',
          noMatches: 'Подходящих взаимодействий не найдено.',
        },
      },
      tooltips: {
        usageMetrics: {
          requests: 'Запросы',
          avgTokens: 'Среднее токенов',
          avgResponseTime: 'Среднее время ответа',
        },
      },
      chartSeries: {
        activeUsers: 'Активные пользователи',
        aiSuccess: 'Успешные AI-запросы',
        telemetryEvents: 'События телеметрии',
        count: 'Количество',
        users: 'Пользователи',
        requests: 'Запросы',
        avgRequests: 'Среднее запросов',
        success: 'Успех',
        rateLimited: 'Лимит превышен',
        providerErrors: 'Ошибки провайдера',
        activity: 'Активность',
      },
      values: {
        ageGroups: {
          lt18: '<18',
          from18to24: '18-24',
          from25to34: '25-34',
          from35to44: '35-44',
          from45to54: '45-54',
          from55Plus: '55+',
        },
        gender: {
          female: 'Женский',
          male: 'Мужской',
          other: 'Другой',
        },
        weightBuckets: {
          lt60: '<60',
          from60to75: '60-75',
          from75to90: '75-90',
          from90Plus: '90+',
        },
        heightBuckets: {
          lt160: '<160',
          from160to175: '160-175',
          from175to190: '175-190',
          from190Plus: '190+',
        },
      },
      eventTypes: {
        appStarted: 'Запуск приложения',
        authLoginSuccess: 'Успешный вход',
        authRegisterSuccess: 'Успешная регистрация',
        onboardingStarted: 'Онбординг начат',
        onboardingPetCreated: 'Питомец создан',
        mealLogged: 'Прием пищи добавлен',
        mealDeleted: 'Прием пищи удален',
        trainingLogged: 'Тренировка добавлена',
        trainingDeleted: 'Тренировка удалена',
        aiRequestStarted: 'AI-запрос начат',
        aiRequestCompleted: 'AI-запрос завершен',
        aiRequestFailed: 'AI-запрос завершился ошибкой',
        aiRateLimited: 'Сработал лимит AI',
        aiProviderFailed: 'Ошибка AI-провайдера',
        sleepPermissionRequested: 'Запрошено разрешение на сон',
        sleepPermissionGranted: 'Разрешение на сон выдано',
        sleepPermissionDenied: 'Разрешение на сон отклонено',
        sleepSyncStarted: 'Синхронизация сна начата',
        sleepSyncCompleted: 'Синхронизация сна завершена',
        sleepSyncFailed: 'Синхронизация сна завершилась ошибкой',
      },
    },
  },
};

resources.en.dashboard = {
  ...resources.en.dashboard,
  navigation: {
    ...resources.en.dashboard.navigation,
    analytics: 'Analytics',
  },
  telemetry: {
    ...resources.en.dashboard.telemetry,
    overview: {
      title: 'Diagnostics Overview',
      description: 'Operational activity and instrumentation health from the current hourly report window.',
      metrics: {
        telemetryEvents: {
          title: 'Telemetry Events',
          subtitle: 'Current report window',
        },
        frontendEvents: {
          title: 'Frontend Events',
          subtitle: 'Logged by client API',
        },
        backendEvents: {
          title: 'Backend Events',
          subtitle: 'Logged by backend services',
        },
        aiSuccess: {
          title: 'AI Successes',
          subtitle: 'Completed AI requests',
        },
      },
    },
    charts: {
      ...resources.en.dashboard.telemetry.charts,
      hourly: 'Hourly Activity Diagnostics',
      hourlyDescription: 'Current hourly report window in Tallinn time. This report does not strictly follow the dashboard date filters.',
    },
    empty: {
      ...resources.en.dashboard.telemetry.empty,
      hourly: 'No hourly diagnostic data available yet.',
    },
  },
  demographics: {
    ...resources.en.dashboard.demographics,
    metricToggleLabel: 'Segment metric',
    metricOptions: {
      requests: 'Requests',
      avgTokens: 'Avg Tokens',
      avgResponseTime: 'Avg Response Time',
    },
    usageBySegment: {
      ...resources.en.dashboard.demographics.usageBySegment,
      description: 'Switch between request volume, average tokens, and average response time for the selected date range.',
      charts: {
        age: 'Age Groups by {{metric}}',
        gender: 'Gender by {{metric}}',
        weight: 'Weight by {{metric}}',
        height: 'Height by {{metric}}',
      },
    },
  },
  analytics: {
    usageOverview: {
      title: 'Usage Overview',
      description: 'Core AI usage KPIs for the selected date range.',
      error: 'Failed to load usage overview data.',
      metrics: {
        totalRequests: {
          title: 'Total AI Requests',
          subtitle: 'Selected date range',
        },
        activeUsers: {
          title: 'Active AI Users',
          subtitle: 'Range-aware requesters',
        },
        requestsPerActiveUser: {
          title: 'Requests per Active User',
          subtitle: 'Across active AI users',
        },
        avgTokensPerRequest: {
          title: 'Avg Tokens per Request',
          subtitle: 'Selected date range',
        },
        avgResponseTime: {
          title: 'Avg Response Time',
          subtitle: 'Selected date range',
        },
        totalOnboardedUsers: {
          title: 'Total Onboarded Users',
          subtitle: 'All-time onboarded users',
          subtitleFallback: 'Fallback from onboarding funnel report',
        },
      },
    },
    usageTrends: {
      title: 'Usage Trends',
      description: 'Switch between requests, tokens, and average response time for the selected date range.',
      metricToggleLabel: 'Trend metric',
      chartTitle: '{{metric}} over Time',
      error: 'Failed to load usage trend data.',
      empty: 'No trend data available for this range.',
      metrics: {
        requests: 'Requests',
        tokens: 'Tokens',
        avgResponseTime: 'Avg Response Time',
      },
    },
    userIntensity: {
      title: 'User Intensity',
      description: 'Current /reports/users snapshot of the most active AI users. This section does not strictly follow the dashboard date filters.',
      charts: {
        intensity: 'Top Users by Request Volume',
      },
      table: {
        title: 'Top Users',
        description: 'Requests, sessions, tokens, response time, and rate-limit pressure by user.',
        headers: {
          user: 'User',
          requests: 'Requests',
          sessions: 'Sessions',
          totalTokens: 'Total Tokens',
          avgResponseTime: 'Avg Response Time',
          rateLimits: 'Rate Limits',
        },
      },
      errors: {
        users: 'Failed to load user reports.',
      },
      empty: {
        users: 'No user usage data available yet.',
      },
    },
    adoption: {
      title: 'Adoption & Conversion',
      description: 'How onboarding completion relates to later AI usage.',
      metrics: {
        totalOnboardedUsers: {
          title: 'Total Onboarded Users',
          subtitle: 'All-time onboarding completions',
        },
        onboardedInRange: {
          title: 'Onboarded in Range',
          subtitle: 'Based on onboarding completion date',
        },
        zeroUsage: {
          title: 'Zero AI Usage',
          subtitle: 'Onboarded users with no AI requests',
        },
        avgRequestsPerOnboarded: {
          title: 'Avg Requests per Onboarded User',
          subtitle: 'Current all-time user usage snapshot',
        },
      },
      charts: {
        onboardedOverTime: 'Onboarded Users over Time',
        onboardedOverTimeDescription: 'Grouped from the existing onboarded users list by onboarding completion date.',
        onboardedSeries: 'Onboarded Users',
      },
      errors: {
        onboarded: 'Failed to load onboarded users.',
      },
      empty: {
        onboarded: 'No onboarded users found in the selected range.',
      },
    },
    engagement: {
      title: 'Engagement vs AI Usage',
      description: 'Compare meals/training engagement events with AI request activity. This section uses current report snapshots rather than the visible date filters.',
      metrics: {
        engagedAvgRequests: {
          title: 'Avg Requests for Engaged Users',
          subtitle: 'Users with meals or training events',
        },
        noEngagementAvgRequests: {
          title: 'Avg Requests with No Engagement',
          subtitle: 'Users with zero meals and training events',
        },
        overlapUsers: {
          title: 'Users with Both Signals',
          subtitle: 'Users with engagement events and AI requests',
        },
      },
      charts: {
        scatter: 'Engagement vs AI Requests',
      },
      axis: {
        engagement: 'Engagement Events',
        requests: 'AI Requests',
      },
      errors: {
        engagement: 'Failed to load engagement comparison data.',
      },
      empty: {
        engagement: 'Not enough engagement and AI usage data for comparison yet.',
      },
    },
  },
};

resources.ru.dashboard = {
  ...resources.ru.dashboard,
  navigation: {
    ...resources.ru.dashboard.navigation,
    analytics: 'Аналитика',
  },
  telemetry: {
    ...resources.ru.dashboard.telemetry,
    overview: {
      title: 'Диагностический обзор',
      description: 'Операционная активность и состояние инструментирования по текущему почасовому окну отчета.',
      metrics: {
        telemetryEvents: {
          title: 'События телеметрии',
          subtitle: 'Текущее окно отчета',
        },
        frontendEvents: {
          title: 'Frontend-события',
          subtitle: 'Логи клиентского API',
        },
        backendEvents: {
          title: 'Backend-события',
          subtitle: 'Логи сервисов бэкенда',
        },
        aiSuccess: {
          title: 'Успешные AI-запросы',
          subtitle: 'Завершенные AI-запросы',
        },
      },
    },
    charts: {
      ...resources.ru.dashboard.telemetry.charts,
      hourly: 'Почасовая диагностика активности',
      hourlyDescription: 'Текущее почасовое окно отчета по времени Таллина. Этот отчет не следует строго выбранному диапазону дат.',
    },
    empty: {
      ...resources.ru.dashboard.telemetry.empty,
      hourly: 'Почасовые диагностические данные пока отсутствуют.',
    },
  },
  demographics: {
    ...resources.ru.dashboard.demographics,
    metricToggleLabel: 'Метрика сегмента',
    metricOptions: {
      requests: 'Запросы',
      avgTokens: 'Средние токены',
      avgResponseTime: 'Среднее время ответа',
    },
    usageBySegment: {
      ...resources.ru.dashboard.demographics.usageBySegment,
      description: 'Переключайтесь между объемом запросов, средними токенами и средним временем ответа для выбранного диапазона дат.',
      charts: {
        age: 'Возрастные группы по метрике {{metric}}',
        gender: 'Пол по метрике {{metric}}',
        weight: 'Весовые группы по метрике {{metric}}',
        height: 'Ростовые группы по метрике {{metric}}',
      },
    },
  },
  analytics: {
    usageOverview: {
      title: 'Обзор использования',
      description: 'Ключевые AI-метрики для выбранного диапазона дат.',
      error: 'Не удалось загрузить обзор использования.',
      metrics: {
        totalRequests: {
          title: 'Всего AI-запросов',
          subtitle: 'Выбранный диапазон дат',
        },
        activeUsers: {
          title: 'Активные AI-пользователи',
          subtitle: 'Пользователи с запросами в диапазоне',
        },
        requestsPerActiveUser: {
          title: 'Запросов на активного пользователя',
          subtitle: 'Среди активных AI-пользователей',
        },
        avgTokensPerRequest: {
          title: 'Средние токены на запрос',
          subtitle: 'Выбранный диапазон дат',
        },
        avgResponseTime: {
          title: 'Среднее время ответа',
          subtitle: 'Выбранный диапазон дат',
        },
        totalOnboardedUsers: {
          title: 'Всего пользователей с онбордингом',
          subtitle: 'Все пользователи с завершенным онбордингом',
          subtitleFallback: 'Резервное значение из отчета по воронке онбординга',
        },
      },
    },
    usageTrends: {
      title: 'Динамика использования',
      description: 'Переключайтесь между запросами, токенами и средним временем ответа для выбранного диапазона дат.',
      metricToggleLabel: 'Метрика тренда',
      chartTitle: '{{metric}} во времени',
      error: 'Не удалось загрузить данные динамики использования.',
      empty: 'Для выбранного диапазона данные тренда отсутствуют.',
      metrics: {
        requests: 'Запросы',
        tokens: 'Токены',
        avgResponseTime: 'Среднее время ответа',
      },
    },
    userIntensity: {
      title: 'Интенсивность пользователей',
      description: 'Текущий снимок /reports/users по самым активным AI-пользователям. Этот раздел не следует строго выбранному диапазону дат.',
      charts: {
        intensity: 'Топ пользователей по числу запросов',
      },
      table: {
        title: 'Топ пользователей',
        description: 'Запросы, сессии, токены, время ответа и превышения лимита по пользователям.',
        headers: {
          user: 'Пользователь',
          requests: 'Запросы',
          sessions: 'Сессии',
          totalTokens: 'Всего токенов',
          avgResponseTime: 'Среднее время ответа',
          rateLimits: 'Лимиты',
        },
      },
      errors: {
        users: 'Не удалось загрузить пользовательские отчеты.',
      },
      empty: {
        users: 'Данные по использованию пользователей пока отсутствуют.',
      },
    },
    adoption: {
      title: 'Активация и конверсия',
      description: 'Как завершение онбординга связано с последующим AI-использованием.',
      metrics: {
        totalOnboardedUsers: {
          title: 'Всего пользователей с онбордингом',
          subtitle: 'Все завершения онбординга',
        },
        onboardedInRange: {
          title: 'Онбординг в диапазоне',
          subtitle: 'По дате завершения онбординга',
        },
        zeroUsage: {
          title: 'Без AI-использования',
          subtitle: 'Пользователи с онбордингом без AI-запросов',
        },
        avgRequestsPerOnboarded: {
          title: 'Среднее запросов на пользователя',
          subtitle: 'Текущий all-time снимок использования',
        },
      },
      charts: {
        onboardedOverTime: 'Пользователи с онбордингом во времени',
        onboardedOverTimeDescription: 'Группировка текущего списка пользователей с онбордингом по дате завершения.',
        onboardedSeries: 'Пользователи с онбордингом',
      },
      errors: {
        onboarded: 'Не удалось загрузить пользователей с онбордингом.',
      },
      empty: {
        onboarded: 'В выбранном диапазоне нет пользователей с онбордингом.',
      },
    },
    engagement: {
      title: 'Вовлеченность и AI-использование',
      description: 'Сравнение событий meals/training с активностью AI-запросов. Раздел использует текущие снимки отчетов, а не видимые фильтры дат.',
      metrics: {
        engagedAvgRequests: {
          title: 'Среднее запросов у вовлеченных пользователей',
          subtitle: 'Пользователи с meals или training событиями',
        },
        noEngagementAvgRequests: {
          title: 'Среднее запросов без вовлеченности',
          subtitle: 'Пользователи без meals и training событий',
        },
        overlapUsers: {
          title: 'Пользователи с обоими сигналами',
          subtitle: 'Есть и события вовлеченности, и AI-запросы',
        },
      },
      charts: {
        scatter: 'Вовлеченность vs AI-запросы',
      },
      axis: {
        engagement: 'События вовлеченности',
        requests: 'AI-запросы',
      },
      errors: {
        engagement: 'Не удалось загрузить данные сравнения вовлеченности.',
      },
      empty: {
        engagement: 'Пока недостаточно данных для сравнения вовлеченности и AI-использования.',
      },
    },
  },
};

resources.en.common.dataMode = {
  selector: 'Data mode selector',
  production: 'Production',
  test: 'Test',
  switchToProduction: 'Switch to production analytics data',
  switchToTest: 'Switch to test analytics data',
  badges: {
    production: 'Production Data',
    test: 'TEST DATA',
  },
};

resources.ru.common.dataMode = {
  selector: '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0430\u0442\u0435\u043b\u044c \u0440\u0435\u0436\u0438\u043c\u0430 \u0434\u0430\u043d\u043d\u044b\u0445',
  production: '\u041f\u0440\u043e\u0434\u0430\u043a\u0448\u043d',
  test: '\u0422\u0435\u0441\u0442',
  switchToProduction: '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043d\u0430 \u043f\u0440\u043e\u0434\u0430\u043a\u0448\u043d-\u0434\u0430\u043d\u043d\u044b\u0435',
  switchToTest: '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043d\u0430 \u0442\u0435\u0441\u0442\u043e\u0432\u044b\u0435 \u0430\u043d\u0430\u043b\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0434\u0430\u043d\u043d\u044b\u0435',
  badges: {
    production: '\u041f\u0440\u043e\u0434\u0430\u043a\u0448\u043d-\u0434\u0430\u043d\u043d\u044b\u0435',
    test: 'TEST DATA',
  },
};

resources.en.common.language = {
  ...resources.en.common.language,
  estonian: 'ET',
  switchToEstonian: 'Switch language to Estonian',
};

resources.ru.common.language = {
  ...resources.ru.common.language,
  estonian: 'ET',
  switchToEstonian: '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u044f\u0437\u044b\u043a \u043d\u0430 \u044d\u0441\u0442\u043e\u043d\u0441\u043a\u0438\u0439',
};

resources.et = {
  common: {
    appName: 'GymBro Analytics',
    language: {
      english: 'EN',
      russian: 'RU',
      estonian: 'ET',
      selector: 'Keele valija',
      switchToEnglish: 'Vaheta keel inglise keeleks',
      switchToRussian: 'Vaheta keel vene keeleks',
      switchToEstonian: 'Vaheta keel eesti keeleks',
    },
    actions: {
      logout: 'Logi v\u00e4lja',
      close: 'Sulge',
    },
    states: {
      error: 'Viga',
    },
    fallback: {
      unknown: 'Teadmata',
    },
    units: {
      ms: 'ms',
    },
    dataMode: {
      selector: 'Andmere\u017eiimi valija',
      production: 'Tootmine',
      test: 'Test',
      switchToProduction: 'Kasuta tootmise anal\u00fc\u00fcsiandmeid',
      switchToTest: 'Kasuta test-anal\u00fc\u00fcsiandmeid',
      badges: {
        production: 'Tootmisandmed',
        test: 'TESTANDMED',
      },
    },
  },
  auth: {
    pageTitle: 'GymBro administraatori sisselogimine',
    loading: 'Autentimist laaditakse...',
    accessDeniedAlert: 'Juurdep\u00e4\u00e4s keelatud. Vajalikud on administraatori \u00f5igused.',
    login: {
      title: 'GymBro Admin',
      emailPlaceholder: 'E-post',
      passwordPlaceholder: 'Parool',
      submit: 'Logi juhtpaneelile sisse',
      errors: {
        notAdmin: 'Juurdep\u00e4\u00e4s keelatud. Sul puuduvad administraatori \u00f5igused.',
        invalidCredentials: 'Sisselogimine eba\u00f5nnestus. Kontrolli andmeid.',
      },
    },
  },
  dashboard: {
    pageTitle: 'GymBro Analytics juhtpaneel',
    title: 'GymBro Analytics',
    headerFallback: 'Juhtpaneel',
    navigation: {
      overview: '\u00dclevaade',
      analytics: 'Anal\u00fc\u00fctika',
      demographics: 'Segmentide analüüs',
      telemetry: 'Telemeetria',
      system: 'S\u00fcsteem',
    },
    loading: 'Anal\u00fc\u00fctika andmeid laaditakse...',
    loadFailed: 'Aruannete laadimine eba\u00f5nnestus.',
    filters: {
      startDate: 'Alguskuup\u00e4ev',
      endDate: 'L\u00f5ppkuup\u00e4ev',
      granularity: 'Granulaarsus',
      options: {
        hour: 'Tund',
        day: 'P\u00e4ev',
        week: 'N\u00e4dal',
        month: 'Kuu',
      },
    },
    overview: {
      totalEngagements: 'Kaasamisi täna',
      onboardedUsers: 'Onboardingu l\u00e4binud kasutajad',
      todayDau: 'T\u00e4nane DAU',
      recentApiErrors: 'Hiljutised API vead',
      charts: {
        dau: 'P\u00e4evased aktiivsed kasutajad (DAU)',
        funnel: 'Globaalne onboardingulehter',
      },
      errors: {
        dau: 'DAU andmete laadimine eba\u00f5nnestus.',
        onboarding: 'Onboardingu andmete laadimine eba\u00f5nnestus.',
      },
      funnel: {
        appInstalled: 'Rakendus avatud',
        registered: 'Registreerunud',
        onboarding: 'Onboarding',
        createdPet: 'Lemmik loodud',
      },
    },
    telemetry: {
      charts: {
        hourly: 'Tunnip\u00f5hine aktiivsuse diagnostika',
        breakdown: 'Telemeetria s\u00fcndmuste jaotus',
        sleep: 'Une telemeetria',
        hourlyDescription: 'Tallinna ajas praegune tunniraporti aken. See raport ei j\u00e4rgi rangelt juhtpaneeli kuup\u00e4evafiltreid.',
      },
      errors: {
        hourly: 'Tunnip\u00f5hise aktiivsuse laadimine eba\u00f5nnestus.',
        breakdown: 'Telemeetria andmete laadimine eba\u00f5nnestus.',
        sleep: 'Une telemeetria andmete laadimine eba\u00f5nnestus.',
      },
      empty: {
        breakdown: 'Telemeetria s\u00fcndmusi pole veel salvestatud.',
        sleep: 'Une telemeetria andmed pole veel saadaval.',
        hourly: 'Tunnip\u00f5hised diagnostikaandmed pole veel saadaval.',
      },
      overview: {
        title: 'Diagnostika \u00fclevaade',
        description: 'Operatiivne aktiivsus ja instrumentatsiooni seis praegusest tunniraporti aknast.',
        metrics: {
          telemetryEvents: {
            title: 'Telemeetria s\u00fcndmused',
            subtitle: 'Praegune raportiaken',
          },
          frontendEvents: {
            title: 'Frontend-s\u00fcndmused',
            subtitle: 'Logitud kliendi API kaudu',
          },
          backendEvents: {
            title: 'Backend-s\u00fcndmused',
            subtitle: 'Logitud backend-teenuste poolt',
          },
          aiSuccess: {
            title: '\u00d5nnestunud AI p\u00e4ringud',
            subtitle: 'L\u00f5petatud AI p\u00e4ringud',
          },
        },
      },
    },
    demographics: {
      usageOverview: {
        title: 'Kasutuse \u00fclevaade',
        description: 'Valitud kuup\u00e4evavahemiku globaalne p\u00e4ringuaktiivsus.',
        error: 'Kasutuse kokkuv\u00f5tte laadimine eba\u00f5nnestus.',
        metrics: {
          totalRequests: {
            title: 'P\u00e4ringuid kokku',
            subtitle: 'Valitud kuup\u00e4evavahemik',
          },
          activeUsers: {
            title: 'Aktiivsed kasutajad',
            subtitle: 'Mitte-admin kasutajad',
          },
          avgRequestsPerUser: {
            title: 'Keskm. p\u00e4ringuid kasutaja kohta',
            subtitle: 'Aktiivsete kasutajate l\u00f5ikes',
          },
          avgTokens: {
            title: 'Keskm. tokeneid',
            subtitle: 'P\u00e4ringu kohta',
          },
          avgResponseTime: {
            title: 'Keskm. vastamisaeg',
            subtitle: 'P\u00e4ringu kohta',
          },
        },
      },
      userDistribution: {
        title: 'Kasutajate jaotus',
        description: 'Kuidas kasutajad jagunevad saadaolevate demograafiliste kategooriate vahel.',
        charts: {
          age: 'Kasutajad vanuser\u00fchma j\u00e4rgi',
          gender: 'Kasutajad soo j\u00e4rgi',
          weight: 'Kasutajad kaalu j\u00e4rgi',
          height: 'Kasutajad pikkuse j\u00e4rgi',
        },
        errors: {
          age: 'Vanuser\u00fchmade jaotuse laadimine eba\u00f5nnestus.',
          gender: 'Soolise jaotuse laadimine eba\u00f5nnestus.',
          weight: 'Kaalujaotuse laadimine eba\u00f5nnestus.',
          height: 'Pikkuse jaotuse laadimine eba\u00f5nnestus.',
        },
        empty: {
          age: 'Vanuser\u00fchmade jaotust pole veel saadaval.',
          gender: 'Soolist jaotust pole veel saadaval.',
          weight: 'Kaalujaotust pole veel saadaval.',
          height: 'Pikkuse jaotust pole veel saadaval.',
        },
      },
      segmentComparison: {
        title: 'Segmentide v\u00f5rdlus',
        description: 'Valitud perioodi k\u00f5ige ja k\u00f5ige v\u00e4hem aktiivsete demograafiliste segmentide otsene v\u00f5rdlus.',
        error: 'Segmentide v\u00f5rdluse laadimine eba\u00f5nnestus.',
        empty: 'Segmentide v\u00f5rdlemiseks pole veel piisavalt andmeid.',
        labels: {
          topSegment: 'Parim segment',
          bottomSegment: 'N\u00f5rgim segment',
          metric: 'M\u00f5\u00f5dik',
          gap: 'Vahe',
          differencePercent: 'Erinevus %',
            allSegments: 'Kõik segmendid',
        },
        dimensions: {
          age: 'Vanus',
          gender: 'Sugu',
          weight: 'Kaal',
          height: 'Pikkus',
        },
        metrics: {
          requests_count: 'P\u00e4ringud',
          avg_requests: 'Keskm. p\u00e4ringud',
        },
        summary: '{{top}} edestas segmenti {{bottom}} valitud perioodil {{percent}}% v\u00f5rra.',
      },
      usageBySegment: {
        title: 'Kasutus segmentide l\u00f5ikes',
        description: 'L\u00fclitu p\u00e4ringumahu, keskmiste tokenite ja keskmise vastamisaja vahel valitud kuup\u00e4evavahemikus.',
        charts: {
          age: 'Vanuser\u00fchmad m\u00f5\u00f5diku {{metric}} j\u00e4rgi',
          gender: 'Sugu m\u00f5\u00f5diku {{metric}} j\u00e4rgi',
          weight: 'Kaal m\u00f5\u00f5diku {{metric}} j\u00e4rgi',
          height: 'Pikkus m\u00f5\u00f5diku {{metric}} j\u00e4rgi',
        },
        errors: {
          age: 'Vanuser\u00fchma anal\u00fc\u00fctika laadimine eba\u00f5nnestus.',
          gender: 'Soo andmete laadimine eba\u00f5nnestus.',
          weight: 'Kaalu andmete laadimine eba\u00f5nnestus.',
          height: 'Pikkuse andmete laadimine eba\u00f5nnestus.',
        },
        empty: {
          age: 'Vanuser\u00fchma anal\u00fc\u00fctika pole veel saadaval.',
          gender: 'Soo andmed pole saadaval.',
          weight: 'Kaalu andmed pole saadaval.',
          height: 'Pikkuse andmed pole saadaval.',
        },
      },
      metricToggleLabel: 'Segmendi m\u00f5\u00f5dik',
      metricOptions: {
        requests: 'P\u00e4ringud',
        avgTokens: 'Keskm. tokenid',
        avgResponseTime: 'Keskm. vastamisaeg',
      },
    },
    system: {
      charts: {
        aiHealth: 'AI teenusepakkuja seisund',
        requestsOverTime: 'P\u00e4ringud ajas',
      },
      errors: {
        aiHealth: 'AI terviseandmete laadimine eba\u00f5nnestus.',
        activityTimeline: 'Aktiivsuse ajajoone laadimine eba\u00f5nnestus.',
      },
      empty: {
        activityTimeline: 'Selles vahemikus pole aktiivsusandmeid.',
      },
    },
    modal: {
      onboardedUsers: {
        title: 'Onboardingu läbinud kasutajad',
        searchPlaceholder: 'Otsi e-posti järgi...',
        loading: 'Onboardingu läbinud kasutajaid laaditakse...',
        error: 'Onboardingu läbinud kasutajate laadimine ebaõnnestus.',
        empty: 'Onboardingu läbinud kasutajaid ei leitud.',
        noMatches: 'Sobivaid onboardingu läbinud kasutajaid ei leitud.',
      },
      dauToday: {
        title: 'Tänane DAU',
        searchPlaceholder: 'Otsi e-posti või nime järgi...',
        loading: 'DAU andmeid laaditakse...',
        error: 'DAU andmete laadimine ebaõnnestus.',
        empty: 'Täna pole aktiivseid kasutajaid.',
        noMatches: 'Sobivaid kasutajaid ei leitud.',
      },
      interactionsToday: {
        title: 'Kaasamisi täna kokku',
        searchPlaceholder: 'Otsi e-posti või detailide järgi...',
        loading: 'Kaasamiste andmeid laaditakse...',
        error: 'Kaasamiste andmete laadimine ebaõnnestus.',
        empty: 'Täna pole kaasamisi.',
        noMatches: 'Sobivaid kaasamisi ei leitud.',
      },
    },
    tooltips: {
      usageMetrics: {
        requests: 'P\u00e4ringud',
        avgTokens: 'Keskm. tokenid',
        avgResponseTime: 'Keskm. vastamisaeg',
      },
    },
    chartSeries: {
      activeUsers: 'Aktiivsed kasutajad',
      aiSuccess: '\u00d5nnestunud AI p\u00e4ringud',
      telemetryEvents: 'Telemeetria s\u00fcndmused',
      count: 'Arv',
      users: 'Kasutajad',
      requests: 'P\u00e4ringud',
      avgRequests: 'Keskm. p\u00e4ringud',
      success: '\u00d5nnestunud',
      rateLimited: 'Piirang rakendus',
      providerErrors: 'Teenusepakkuja vead',
      activity: 'Aktiivsus',
    },
    values: {
      ageGroups: {
        lt18: '<18',
        from18to24: '18-24',
        from25to34: '25-34',
        from35to44: '35-44',
        from45to54: '45-54',
        from55Plus: '55+',
      },
      gender: {
        female: 'Naine',
        male: 'Mees',
        other: 'Muu',
      },
      weightBuckets: {
        lt60: '<60',
        from60to75: '60-75',
        from75to90: '75-90',
        from90Plus: '90+',
      },
      heightBuckets: {
        lt160: '<160',
        from160to175: '160-175',
        from175to190: '175-190',
        from190Plus: '190+',
      },
    },
    eventTypes: {
      appStarted: 'Rakenduse k\u00e4ivitus',
      authLoginSuccess: 'Sisselogimine \u00f5nnestus',
      authRegisterSuccess: 'Registreerimine \u00f5nnestus',
      onboardingStarted: 'Onboarding alustatud',
      onboardingPetCreated: 'Lemmik loodud',
      mealLogged: 'Toidukord lisatud',
      mealDeleted: 'Toidukord kustutatud',
      trainingLogged: 'Treening lisatud',
      trainingDeleted: 'Treening kustutatud',
      aiRequestStarted: 'AI p\u00e4ring alustatud',
      aiRequestCompleted: 'AI p\u00e4ring l\u00f5petatud',
      aiRequestFailed: 'AI p\u00e4ring eba\u00f5nnestus',
      aiRateLimited: 'AI piirang rakendus',
      aiProviderFailed: 'AI teenusepakkuja viga',
      sleepPermissionRequested: 'Une loa p\u00e4ring',
      sleepPermissionGranted: 'Une luba antud',
      sleepPermissionDenied: 'Une luba keelatud',
      sleepSyncStarted: 'Une s\u00fcnkroniseerimine alustatud',
      sleepSyncCompleted: 'Une s\u00fcnkroniseerimine l\u00f5petatud',
      sleepSyncFailed: 'Une s\u00fcnkroniseerimine eba\u00f5nnestus',
    },
    analytics: {
      usageOverview: {
        title: 'Kasutuse \u00fclevaade',
        description: 'Valitud kuup\u00e4evavahemiku peamised AI kasutuse KPI-d.',
        error: 'Kasutuse \u00fclevaate laadimine eba\u00f5nnestus.',
        metrics: {
          totalRequests: {
            title: 'AI p\u00e4ringuid kokku',
            subtitle: 'Valitud kuup\u00e4evavahemik',
          },
          activeUsers: {
            title: 'Aktiivsed AI kasutajad',
            subtitle: 'Vahemikup\u00f5hised p\u00e4ringute tegijad',
          },
          requestsPerActiveUser: {
            title: 'P\u00e4ringuid aktiivse kasutaja kohta',
            subtitle: 'Aktiivsete AI kasutajate l\u00f5ikes',
          },
          avgTokensPerRequest: {
            title: 'Keskm. tokeneid p\u00e4ringu kohta',
            subtitle: 'Valitud kuup\u00e4evavahemik',
          },
          avgResponseTime: {
            title: 'Keskm. vastamisaeg',
            subtitle: 'Valitud kuup\u00e4evavahemik',
          },
          totalOnboardedUsers: {
            title: 'Onboardingu l\u00e4binud kasutajaid kokku',
            subtitle: 'K\u00f5ik onboardingu l\u00e4binud kasutajad',
            subtitleFallback: 'Varuvariant onboardingulehtri raportist',
          },
        },
      },
      usageTrends: {
        title: 'Kasutustrendid',
        description: 'L\u00fclitu p\u00e4ringute, tokenite ja keskmise vastamisaja vahel valitud kuup\u00e4evavahemikus.',
        metricToggleLabel: 'Trendim\u00f5\u00f5dik',
        chartTitle: '{{metric}} ajas',
        error: 'Kasutustrendi andmete laadimine eba\u00f5nnestus.',
        empty: 'Selles vahemikus pole trendiandmeid.',
        metrics: {
          requests: 'P\u00e4ringud',
          tokens: 'Tokenid',
          avgResponseTime: 'Keskm. vastamisaeg',
        },
      },
      userIntensity: {
        title: 'Kasutajate intensiivsus',
        description: 'Praegune /reports/users hetkepilt k\u00f5ige aktiivsematest AI kasutajatest. See jaotis ei j\u00e4rgi rangelt juhtpaneeli kuup\u00e4evafiltreid.',
        charts: {
          intensity: 'Tippkasutajad p\u00e4ringumahu j\u00e4rgi',
        },
        table: {
          title: 'Tippkasutajad',
          description: 'P\u00e4ringud, seansid, tokenid, vastamisaeg ja piirangute surve kasutaja kaupa.',
          headers: {
            user: 'Kasutaja',
            requests: 'P\u00e4ringud',
            sessions: 'Seansid',
            totalTokens: 'Tokeneid kokku',
            avgResponseTime: 'Keskm. vastamisaeg',
            rateLimits: 'Piirangud',
          },
        },
        errors: {
          users: 'Kasutajaaruannete laadimine eba\u00f5nnestus.',
        },
        empty: {
          users: 'Kasutajate kasutusandmed pole veel saadaval.',
        },
      },
      adoption: {
        title: 'Kasutuselev\u00f5tt ja konversioon',
        description: 'Kuidas onboardingu l\u00f5petamine seostub hilisema AI kasutusega.',
        metrics: {
          totalOnboardedUsers: {
            title: 'Onboardingu l\u00e4binud kasutajaid kokku',
            subtitle: 'K\u00f5ik onboardingu l\u00f5puleviimised',
          },
          onboardedInRange: {
            title: 'Vahemikus l\u00e4binud',
            subtitle: 'Onboardingu l\u00f5petamise kuup\u00e4eva alusel',
          },
          zeroUsage: {
            title: 'AI kasutus puudub',
            subtitle: 'Onboardingu l\u00e4binud kasutajad ilma AI p\u00e4ringuteta',
          },
          avgRequestsPerOnboarded: {
            title: 'Keskm. p\u00e4ringuid onboardingu l\u00e4binud kasutaja kohta',
            subtitle: 'Praegune k\u00f5igi aegade kasutuse hetkepilt',
          },
        },
        charts: {
          onboardedOverTime: 'Onboardingu l\u00e4binud kasutajad ajas',
          onboardedOverTimeDescription: 'Grupeeritud olemasolevast onboardingu l\u00e4binud kasutajate nimekirjast l\u00f5petamise kuup\u00e4eva j\u00e4rgi.',
          onboardedSeries: 'Onboardingu l\u00e4binud kasutajad',
        },
        errors: {
          onboarded: 'Onboardingu l\u00e4binud kasutajate laadimine eba\u00f5nnestus.',
        },
        empty: {
          onboarded: 'Valitud vahemikus ei leitud onboardingu l\u00e4binud kasutajaid.',
        },
      },
      engagement: {
        title: 'Kaasatus vs AI kasutus',
        description: 'V\u00f5rdle toidukordade ja treeningute kaasatuse s\u00fcndmusi AI p\u00e4ringute aktiivsusega. See jaotis kasutab praegusi raporti hetkepilte, mitte n\u00e4htavaid kuup\u00e4evafiltreid.',
        metrics: {
          engagedAvgRequests: {
            title: 'Keskm. p\u00e4ringuid kaasatud kasutajatel',
            subtitle: 'Kasutajad toidukorra v\u00f5i treeningu s\u00fcndmustega',
          },
          noEngagementAvgRequests: {
            title: 'Keskm. p\u00e4ringuid ilma kaasatuseta',
            subtitle: 'Kasutajad, kellel pole toidu ega treeningu s\u00fcndmusi',
          },
          overlapUsers: {
            title: 'M\u00f5lema signaaliga kasutajad',
            subtitle: 'Kasutajad kaasatuse s\u00fcndmuste ja AI p\u00e4ringutega',
          },
        },
        charts: {
          scatter: 'Kaasatus vs AI p\u00e4ringud',
        },
        axis: {
          engagement: 'Kaasatuse s\u00fcndmused',
          requests: 'AI p\u00e4ringud',
        },
        errors: {
          engagement: 'Kaasatuse v\u00f5rdlusandmete laadimine eba\u00f5nnestus.',
        },
        empty: {
          engagement: 'Kaasatuse ja AI kasutuse v\u00f5rdlemiseks pole veel piisavalt andmeid.',
        },
      },
    },
  },
};

export default resources;
