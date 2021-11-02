import { useAuthContext } from '@authentication/AuthContext';
import { ErrorState } from '@components/ErrorState/ErrorState';
import { SessionPageSearchParams } from '@pages/Player/utils/utils';
import { message } from 'antd';
import classNames from 'classnames';
import { H } from 'highlight.run';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import Skeleton from 'react-loading-skeleton';
import { useHistory, useParams } from 'react-router';
import AsyncSelect from 'react-select/async';
import { useLocalStorage } from 'react-use';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from 'recharts';

import Button from '../../components/Button/Button/Button';
import { StandardDropdown } from '../../components/Dropdown/StandardDropdown/StandardDropdown';
import { RechartTooltip } from '../../components/recharts/RechartTooltip/RechartTooltip';
import Tooltip from '../../components/Tooltip/Tooltip';
import {
    useGetDailyErrorFrequencyQuery,
    useGetErrorGroupQuery,
} from '../../graph/generated/hooks';
import { ErrorGroup, Maybe } from '../../graph/generated/schemas';
import SvgDownloadIcon from '../../static/DownloadIcon';
import {
    ErrorSearchContextProvider,
    ErrorSearchParams,
} from '../Errors/ErrorSearchContext/ErrorSearchContext';
import { EmptyErrorsSearchParams } from '../Errors/ErrorsPage';
import { IntegrationCard } from '../Sessions/IntegrationCard/IntegrationCard';
import ErrorDescription from './components/ErrorDescription/ErrorDescription';
import { parseErrorDescriptionList } from './components/ErrorDescription/utils/utils';
import ErrorAffectedUsers from './components/ErrorRightPanel/components/ErrorAffectedUsers/ErrorAffectedUsers';
import NoActiveErrorCard from './components/ErrorRightPanel/components/NoActiveErrorCard/NoActiveErrorCard';
import ErrorRightPanel from './components/ErrorRightPanel/ErrorRightPanel';
import { ErrorSearchOption } from './components/ErrorSearch/ErrorSearch';
import ErrorSearchPanel from './components/ErrorSearchPanel/ErrorSearchPanel';
import ErrorTitle from './components/ErrorTitle/ErrorTitle';
import StackTraceSection from './components/StackTraceSection/StackTraceSection';
import { ErrorPageUIContextProvider } from './context/ErrorPageUIContext';
import styles from './ErrorPage.module.scss';
import useErrorPageConfiguration from './utils/ErrorPageUIConfiguration';

const ErrorPage = ({ integrated }: { integrated: boolean }) => {
    const { error_secure_id, project_id } = useParams<{
        error_secure_id: string;
        project_id: string;
    }>();
    const history = useHistory();

    const { isLoggedIn } = useAuthContext();
    const {
        data,
        loading,
        error: errorQueryingErrorGroup,
    } = useGetErrorGroupQuery({
        variables: { secure_id: error_secure_id },
        skip: !error_secure_id,
        onCompleted: () => {
            H.track('Viewed error', { is_guest: !isLoggedIn });
        },
    });
    const [segmentName, setSegmentName] = useState<string | null>(null);
    const [cachedParams, setCachedParams] = useLocalStorage<ErrorSearchParams>(
        `cachedErrorParams-v2-${
            segmentName || 'no-selected-segment'
        }-${project_id}`,
        {}
    );
    const [searchParams, setSearchParams] = useState<ErrorSearchParams>(
        cachedParams || EmptyErrorsSearchParams
    );
    const [existingParams, setExistingParams] = useState<ErrorSearchParams>({});
    const [searchBarRef, setSearchBarRef] = useState<
        AsyncSelect<ErrorSearchOption, true> | undefined
    >(undefined);
    const newCommentModalRef = useRef<HTMLDivElement>(null);
    const dateFromSearchParams = new URLSearchParams(location.search).get(
        SessionPageSearchParams.date
    );

    useEffect(() => setCachedParams(searchParams), [
        searchParams,
        setCachedParams,
    ]);

    useEffect(() => {
        if (dateFromSearchParams) {
            const start_date = moment(dateFromSearchParams);
            const end_date = moment(dateFromSearchParams);

            setSearchParams(() => ({
                // We are explicitly clearing any existing search params so the only applied search param is the date range.
                ...EmptyErrorsSearchParams,
                date_range: {
                    start_date: start_date.startOf('day').toDate(),
                    end_date: end_date.endOf('day').toDate(),
                },
            }));
            message.success(
                `Showing errors that were thrown on ${dateFromSearchParams}`
            );
            history.replace({ search: '' });
        }
    }, [history, dateFromSearchParams, setSearchParams]);

    const { showLeftPanel } = useErrorPageConfiguration();

    return (
        <ErrorSearchContextProvider
            value={{
                searchParams,
                setSearchParams,
                existingParams,
                setExistingParams,
                segmentName,
                setSegmentName,
            }}
        >
            <Helmet>
                <title>Errors</title>
            </Helmet>
            <ErrorPageUIContextProvider
                value={{ searchBarRef, setSearchBarRef }}
            >
                {!integrated && <IntegrationCard />}
                <div
                    className={classNames(styles.errorPage, {
                        [styles.withoutLeftPanel]: !showLeftPanel,
                        [styles.empty]:
                            !error_secure_id || errorQueryingErrorGroup,
                    })}
                >
                    <div
                        className={classNames(styles.errorPageLeftColumn, {
                            [styles.hidden]: !showLeftPanel,
                        })}
                    >
                        <ErrorSearchPanel />
                    </div>
                    {error_secure_id && !errorQueryingErrorGroup ? (
                        <>
                            <Helmet>
                                <title>
                                    Errors:{' '}
                                    {getHeaderFromError(
                                        data?.error_group?.event ?? []
                                    )}
                                </title>
                            </Helmet>
                            <div
                                className={classNames(
                                    styles.errorPageCenterColumn,
                                    {
                                        [styles.hidden]: !showLeftPanel,
                                    }
                                )}
                            >
                                <div className={styles.titleContainer}>
                                    {loading ? (
                                        <Skeleton
                                            count={1}
                                            style={{ width: 300, height: 37 }}
                                        />
                                    ) : (
                                        <ErrorTitle
                                            errorGroup={data?.error_group}
                                        />
                                    )}
                                </div>
                                <div className={styles.eventText}>
                                    {loading ? (
                                        <Skeleton
                                            count={1}
                                            style={{
                                                height: '2ch',
                                                marginBottom: 0,
                                            }}
                                        />
                                    ) : (
                                        <ErrorDescription
                                            errorGroup={data?.error_group}
                                        />
                                    )}
                                </div>
                                <h3 className={styles.titleWithAction}>
                                    Stack Trace
                                    <Tooltip title="Download the stack trace">
                                        <Button
                                            trackingId="DownloadErrorStackTrace"
                                            iconButton
                                            type="text"
                                            disabled={loading}
                                            onClick={() => {
                                                if (data?.error_group) {
                                                    let stackTraceStr =
                                                        data.error_group
                                                            .stack_trace || '';
                                                    let isJson = true;

                                                    if (
                                                        data.error_group
                                                            .structured_stack_trace
                                                            ?.length > 0
                                                    ) {
                                                        const traceLines = data.error_group.structured_stack_trace.map(
                                                            (stack_trace) => {
                                                                return `${stack_trace?.fileName} in ${stack_trace?.functionName} at line ${stack_trace?.lineNumber}:${stack_trace?.columnNumber}`;
                                                            }
                                                        );
                                                        stackTraceStr = JSON.stringify(
                                                            traceLines,
                                                            undefined,
                                                            2
                                                        );
                                                    } else {
                                                        try {
                                                            JSON.parse(
                                                                stackTraceStr
                                                            );
                                                        } catch {
                                                            isJson = false;
                                                        }
                                                    }

                                                    const a = document.createElement(
                                                        'a'
                                                    );
                                                    const file = new Blob(
                                                        [stackTraceStr],
                                                        {
                                                            type: isJson
                                                                ? 'application/json'
                                                                : 'text/plain',
                                                        }
                                                    );

                                                    a.href = URL.createObjectURL(
                                                        file
                                                    );
                                                    a.download = `stack-trace-for-error-${error_secure_id}.${
                                                        isJson ? 'json' : 'txt'
                                                    }`;
                                                    a.click();

                                                    URL.revokeObjectURL(a.href);
                                                }
                                            }}
                                        >
                                            <SvgDownloadIcon />
                                        </Button>
                                    </Tooltip>
                                </h3>
                                <div className={styles.fieldWrapper}>
                                    <StackTraceSection
                                        loading={loading}
                                        errorGroup={data?.error_group}
                                    />
                                </div>
                                {loading && (
                                    <h3>
                                        <Skeleton
                                            duration={1}
                                            count={1}
                                            style={{ width: 300 }}
                                        />
                                    </h3>
                                )}
                                {!loading && data?.error_group?.project_id && (
                                    <div className={styles.fieldWrapper}>
                                        <ErrorFrequencyGraph
                                            errorGroup={data?.error_group}
                                        />
                                    </div>
                                )}
                            </div>
                            <div
                                className={styles.errorPageRightColumn}
                                ref={newCommentModalRef}
                            >
                                <ErrorAffectedUsers
                                    errorGroup={data}
                                    loading={loading}
                                />
                                <ErrorRightPanel
                                    errorGroup={data}
                                    parentRef={newCommentModalRef}
                                />
                            </div>
                        </>
                    ) : errorQueryingErrorGroup ? (
                        <ErrorState message="This error does not exist or has not been made public." />
                    ) : (
                        <NoActiveErrorCard />
                    )}
                </div>
            </ErrorPageUIContextProvider>
        </ErrorSearchContextProvider>
    );
};

type FrequencyGraphProps = {
    errorGroup?: Maybe<Pick<ErrorGroup, 'secure_id' | 'project_id'>>;
};

type ErrorFrequency = {
    date: string;
    occurrences: number;
};

const LookbackPeriod = 60;

const timeFilter = [
    { label: 'Last 24 hours', value: 2 },
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
    { label: 'This year', value: 30 * 12 },
] as const;

export const ErrorFrequencyGraph: React.FC<FrequencyGraphProps> = ({
    errorGroup,
}) => {
    const [errorDates, setErrorDates] = useState<Array<ErrorFrequency>>(
        Array(LookbackPeriod).fill(0)
    );
    const [totalErrors, setTotalErrors] = useState<number>(0);
    const [dateRangeLength, setDateRangeLength] = useState<number>(
        timeFilter[1].value
    );

    useEffect(() => {
        setErrorDates(Array(dateRangeLength).fill(0));
    }, [dateRangeLength]);

    useGetDailyErrorFrequencyQuery({
        variables: {
            project_id: `${errorGroup?.project_id}`,
            error_group_secure_id: `${errorGroup?.secure_id}`,
            date_offset: dateRangeLength - 1,
        },
        skip: !errorGroup,
        onCompleted: (response) => {
            const errorData = response.dailyErrorFrequency.map((val, idx) => ({
                date: moment()
                    .startOf('day')
                    .subtract(dateRangeLength - 1 - idx, 'days')
                    .format('D MMM YYYY'),
                occurrences: val,
            }));
            setTotalErrors(
                response.dailyErrorFrequency.reduce((acc, val) => acc + val, 0)
            );
            setErrorDates(errorData);
        },
    });

    return (
        <>
            <div
                className={classNames(
                    styles.titleWithAction,
                    styles.titleWithMargin
                )}
            >
                <h3>Error Frequency</h3>
                <StandardDropdown
                    data={timeFilter}
                    defaultValue={timeFilter[1]}
                    onSelect={setDateRangeLength}
                    disabled={!errorGroup}
                />
            </div>
            <div className={classNames(styles.section, styles.graphSection)}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        width={500}
                        height={300}
                        data={errorDates}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid stroke={'#D9D9D9'} vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={false}
                            axisLine={{ stroke: '#D9D9D9' }}
                        />
                        <YAxis
                            tickCount={10}
                            interval="preserveStart"
                            allowDecimals={false}
                            hide={true}
                        />
                        <RechartsTooltip content={<RechartTooltip />} />
                        <Bar dataKey="occurrences" radius={[2, 2, 0, 0]}>
                            {errorDates.map((e, i) => (
                                <Cell
                                    key={i}
                                    fill={
                                        e.occurrences >
                                        Math.max(totalErrors * 0.1, 10)
                                            ? 'var(--color-red-500)'
                                            : 'var(--color-brown)'
                                    }
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className={styles.graphLabels}>
                    <div>{`Total Occurrences: ${totalErrors}`}</div>
                </div>
            </div>
        </>
    );
};

export const getHeaderFromError = (
    errorMsg: Maybe<string>[] | undefined
): string => {
    const eventText = parseErrorDescriptionList(errorMsg)[0];
    let title = '';
    // Try to get the text in the form Text: ....
    const splitOnColon = eventText?.split(':') ?? [];
    if (
        splitOnColon.length &&
        (!splitOnColon[0].includes(' ') ||
            splitOnColon[0].toLowerCase().includes('error'))
    ) {
        return splitOnColon[0];
    }
    // Try to get text in the form "'Something' Error" in the event.
    const split = eventText?.split(' ') ?? [];
    let prev = '';
    for (let i = 0; i < split?.length; i++) {
        const curr = split[i];
        if (curr.toLowerCase().includes('error')) {
            title = (prev ? prev + ' ' : '') + curr;
            return title;
        }
        prev = curr;
    }

    return errorMsg?.join() ?? '';
};

export default ErrorPage;
